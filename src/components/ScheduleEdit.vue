<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { globalStore } from "../store/globals.ts";
import Authenticator from "./modules/Authenticator.vue";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const globals = globalStore();
const { apiURL, people, days, hours, dayID, month, day } = storeToRefs(globals);

var authenticated = ref(true);
var dataLoading = ref(false);

var selectedPerson = ref(null);
var selectedDay = ref(-1);

var isResizing = ref(false);
var originalValue = 0;
var startValue = 0;
var currentProp = "";
var selectedItem = ref(null);

const currentSchedule = ref(null);
const pulledItems = ref(
  {
    day: 3,
    scheduleItems: [
      { name: "Morning Routine", start: 8.5, end: 9 },
      { name: "Work", start: 9, end: 17 },
      { name: "Girl's Time", start: 17, end: 18 },
      { name: "Dinner/Cleanup", start: 18, end: 19 },
      { name: "Projects", start: 19, end: 21 },
      { name: "Night Routine", start: 21, end: 22 },
      { name: "My Time", start: 22, end: 24 },
    ],
    assignedTo: 1,
  }
);

const openSlots = computed(() => {
  var openSlotsArray = [];
  if (currentSchedule.value) {
    var si = currentSchedule.value.scheduleItems;
    for (let i = 0; i < (si.length + 1); i++) {
      var start = Math.ceil(i == 0 ? 0 : si[i - 1].end);
      var end = Math.floor(i == (si.length) ? 24 : si[i].start);
      for (let ii = start; ii < end; ii++) {
        openSlotsArray.push(ii);
      }
    }
  }
  return openSlotsArray;
})

async function getSchedule() {
  if (selectedPerson.value && selectedDay.value > -1) {
    dataLoading.value = true;
    var sendDay = selectedDay.value;
    if (sendDay == 10) { sendDay = 1 }
    const res = await axios.get(apiURL.value + "schedule?day=" + sendDay + "&assignedTo=" + selectedPerson.value._id);
    console.log(res.data);
    //if there is a schedule for this person/day set it to currentSchedule
    dataLoading.value = false;
    if (res.data.length > 0) {
      currentSchedule.value = res.data[0];
    } else {
      //otherwise build a new one
      currentSchedule.value = {
        day: selectedDay.value,
        scheduleItems: [],
        assignedTo: selectedPerson.value._id,
      };
    }
  }
}
function addItem(i) {
  currentSchedule.value.scheduleItems.push({ name: "Item Name", start: i, end: i + 1 });
}
function resizeStart(item, prop, event) {
  selectedItem.value = item;
  currentProp = prop;
  originalValue = selectedItem.value[currentProp];
  startValue = event.pageX;
  isResizing.value = true;
}
function resizeUpdate(event) {
  if (isResizing.value) {
    var diff = startValue - event.pageX;
    var newVal = roundToHalf(originalValue - diff * 0.0063);
    var otherVal = currentProp == "start" ? selectedItem.value.end : selectedItem.value.start;
    if (currentProp == "start" && otherVal <= newVal) {
      newVal = otherVal - 0.5;
    }
    if (currentProp == "end" && otherVal >= newVal) {
      newVal = otherVal + 0.5;
    }
    selectedItem.value[currentProp] = newVal;
  }
}
function resizeEnd() {
  if (isResizing.value) {
    var newVal = roundToHalf(selectedItem.value[currentProp]);
    selectedItem.value[currentProp] = newVal;
    currentProp = "";
    isResizing.value = false;
  }
}
function roundToHalf(value) {
  var converted = parseFloat(value); // Make sure we have a number
  var decimal = converted - parseInt(converted, 10);
  decimal = Math.round(decimal * 10);
  if (decimal == 5) {
    return parseInt(converted, 10) + 0.5;
  }
  if (decimal < 2 || decimal > 8) {
    return Math.round(converted);
  } else {
    return parseInt(converted, 10) + 0.5;
  }
}
function removeItem(index) {
  currentSchedule.value.scheduleItems.splice(index, 1);
}

async function saveSchedule() {
  //if this is to be applied to all weekdays, then loop over 5 times
  dataLoading.value = true;
  delete currentSchedule.value._id;

  try {
    if (selectedDay.value == 10) {
      for (let i = 1; i < 6; i++) {
        currentSchedule.value.day = i;
        const res = await axios.post(apiURL.value + "schedule", currentSchedule.value);
        console.log(res);
      }
      currentSchedule.value.day = 1;
    } else {
      const res = await axios.post(apiURL.value + "schedule", currentSchedule.value);
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  }
  dataLoading.value = false;
}

</script>

<template>
  <div v-if="authenticated" class="bg-slate-200 w-full h-full" @mousemove="resizeUpdate" @mouseup="resizeEnd">
    <div class="w-full text-center text-5xl py-10">EDIT SCHEDULE</div>
    <!-- Dropdowns -->
    <div class="w-full flex justify-center gap-5">
      <select class="border-2 rounded-xl py-3 px-6 text-2xl text-center w-96" v-model="selectedPerson" @change="getSchedule()">
        <option :value="null" class="text-lg text-center w-96">Select a Person</option>
        <option :value="p" v-for="(p, i) in people" :key="i" class="text-lg text-center w-96">{{ p.name }}</option>
      </select>
      <select class="border-2 rounded-xl py-3 px-6 text-2xl text-center w-96" v-model="selectedDay" @change="getSchedule()">
        <option :value="-1" class="text-lg text-center w-96">Select a Day</option>
        <option :value="i" v-for="(d, i) in days" :key="i" class="text-lg text-center w-96">{{ d }}</option>
        <option :value="10" class="text-lg text-center w-96">All Weekdays</option>
      </select>
    </div>
    <!-- Loader -->
    <div class="w-full flex justify-center mt-24" v-if="dataLoading">
      <div class="loader"></div>
    </div>
    <!-- Schedule Editor -->
    <div class="w-full overflow-x-auto overflow-y-hidden mt-12" v-if="currentSchedule && !dataLoading">
      <div class="w-fit h-16 flex justify-center items-center text-gray-500 font-bold border-gray-300 border-y-2 relative">
        <div class="border-x border-gray-300 w-40 h-full flex items-center justify-center select-none" v-for="(h, i) in hours" :key="i">{{ h }}</div>
      </div>
      <div class="w-fit h-28 flex justify-start items-center bg-white border-b-4 border-gray-300 relative">
        <div v-for="(h, i) in hours" :key="i" class="w-40 h-28"></div>
        <div class="absolute w-full h-full">
          <div v-for="(s, index) in currentSchedule.scheduleItems" :key="index" class="h-24 absolute top-[6px] rounded flex text-center justify-between items-center break-words border-2 border-white border-opacity-20" :style="'left: ' + s.start * 10 + 'rem; width: ' + (s.end - s.start) * 10 + 'rem; background-color: ' + selectedPerson.color + ';'">
            <div @mousedown="resizeStart(s, 'start', $event)" class="w-3 h-10 flex items-center bg-black bg-opacity-15" :class="{ 'cursor-col-resize': !isResizing }"><chevron-left-icon class="w-5 text-white" /></div>
            <div v-if="isResizing" class="bg-black bg-opacity-10 text-center w-full m-1 rounded text-white select-none">{{ s.name }}</div>
            <input v-else type="text" v-model="s.name" class="bg-black bg-opacity-10 text-center w-full m-1 rounded text-white outline-none" />
            <div @mousedown="resizeStart(s, 'end', $event)" class="w-3 h-10 flex items-center bg-black bg-opacity-15" :class="{ 'cursor-col-resize': !isResizing }"><chevron-right-icon class="w-5 text-white" /></div>
            <div class="absolute top-0 right-0 rounded-full w-5 h-5 bg-black bg-opacity-15 hover:bg-opacity-30 text-white cursor-pointer flex justify-center items-center text-sm" @click="removeItem(index);">✖</div>
          </div>
          <div v-for="(os, i) in openSlots" :key="i" class="absolute w-24 h-12 top-8 bg-slate-500 flex justify-center items-center rounded text-white font-bold text-4xl select-none cursor-pointer opacity-10 hover:opacity-50" :style="'left: ' + ((os * 10) + 2) + 'rem;'" @click="addItem(os)">+</div>
        </div>
      </div>
    </div>
    <!-- Save Button -->
    <div v-if="currentSchedule && !dataLoading" class="w-full flex justify-center">
      <div class="py-2 px-5 rounded bg-indigo-400 text-white text-lg mt-10 cursor-pointer hover:bg-indigo-500" @click="saveSchedule()">Save Schedule</div>
    </div>
  </div>
  <div class="flex justify-center items-center" v-else>
    <Authenticator @authenticated="() => (authenticated = true)" />
  </div>
</template>
