<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { globalStore } from "../store/globals.ts";
import Authenticator from "./modules/Authenticator.vue";

const globals = globalStore();
const { people, days, hours, dayID, month, day } = storeToRefs(globals);

var authenticated = ref(true);
var dataLoading = ref(false);

var selectedPerson = ref(null);
var selectedDay = ref(-1);

var isResizing = ref(false);
var originalValue = 0;
var startValue = 0;
var currentProp = "";
var selectedItem = ref(null);

const scheduleItems = ref([]);
const pulledItems = ref([
  { day: 3, name: "Morning Routine", start: 8.5, end: 9, assignedTo: 1 },
  { day: 3, name: "Work", start: 9, end: 17, assignedTo: 1 },
  { day: 3, name: "Girl's Time", start: 17, end: 18, assignedTo: 1 },
  { day: 3, name: "Dinner/Cleanup", start: 18, end: 19, assignedTo: 1 },
  { day: 3, name: "Projects", start: 19, end: 21, assignedTo: 1 },
  { day: 3, name: "Night Routine", start: 21, end: 22, assignedTo: 1 },
  { day: 3, name: "My Time", start: 22, end: 24, assignedTo: 1 },
]);

function getSchedule() {
  if (selectedPerson.value && selectedDay.value > -1) {
    scheduleItems.value = pulledItems.value;
  }
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
  if (decimal < 3 || decimal > 7) {
    return Math.round(converted);
  } else {
    return parseInt(converted, 10) + 0.5;
  }
}

function saveSchedule() {}
</script>

<template>
  <div v-if="authenticated" class="bg-slate-200 w-full h-full" @mousemove="resizeUpdate" @mouseup="resizeEnd">
    <div class="loader" v-if="dataLoading"></div>
    <div v-else class="contents">
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
      <!-- Schedule Editor -->
      <div class="w-full overflow-x-auto overflow-y-hidden mt-12" v-if="scheduleItems">
        <div class="w-fit h-16 flex justify-center items-center text-gray-500 font-bold border-gray-300 border-y-2 relative">
          <div class="border-x border-gray-300 w-40 h-full flex items-center justify-center select-none" v-for="(h, i) in hours" :key="i">{{ h }}</div>
        </div>
        <div class="w-fit h-28 flex justify-start items-center bg-white border-b-4 border-gray-300 relative">
          <div class="w-40 h-28" v-for="(h, i) in hours" :key="i"></div>
          <div class="absolute w-full h-full">
            <div
              v-for="(s, index) in scheduleItems"
              :key="index"
              class="h-24 absolute top-[6px] rounded text-white flex text-center justify-between items-center break-words border-x-2 border-white border-opacity-20"
              :style="'left: ' + s.start * 10 + 'rem; width: ' + (s.end - s.start) * 10 + 'rem; background-color: ' + selectedPerson.color + ';'"
            >
              <div @mousedown="resizeStart(s, 'start', $event)" class="w-1 h-full opacity-0 cursor-col-resize"></div>
              <input type="text" v-model="s.name" class="bg-black bg-opacity-10 text-center w-full m-1" />
              <div @mousedown="resizeStart(s, 'end', $event)" class="w-1 h-full opacity-0 cursor-col-resize"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Save Button -->
      <div v-if="scheduleItems" class="w-full flex justify-center">
        <div class="py-2 px-5 rounded bg-indigo-500 text-white text-lg mt-10" @click="saveSchedule()">Save Schedule</div>
      </div>
    </div>
  </div>
  <div class="flex justify-center items-center" v-else>
    <Authenticator @authenticated="() => (authenticated = true)" />
  </div>
</template>
