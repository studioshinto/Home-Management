<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { globalStore } from "../store/globals.ts";
import axios from "axios";
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';

const globals = globalStore();
const { apiURL, people, days, hours, dayID, month, day } = storeToRefs(globals);

const currentHours = ref(0);

const loading = ref(true);

onMounted(() => {
  getSchedules();
  getCurrentTime();
});

async function getSchedules() {
  const res = await axios.get(apiURL.value + "schedule?day=" + dayID.value);
  console.log(res.data);
  //if there is a schedule for this person/day set it to currentSchedule
  loading.value = false;
  res.data.forEach((si) => {
    people.value.forEach((p) => {
      if (si.assignedTo == p._id) {
        p.schedule = si.scheduleItems;
      }
    });
  });
  console.log(people.value);
}

function getCurrentTime() {
  var now = new Date();
  var hours = now.getHours();
  var mins = now.getMinutes();

  currentHours.value = hours + (mins / 60);

  if (currentHours.value > 24) {
    location.reload();
  }
  setTimeout(() => {
    getCurrentTime();
  }, 300000);

  //slight delay before getting and setting arrow component
  setTimeout(() => {
    var a = document.getElementById("Arrow");
    if (a) {
      a.scrollIntoView({
        behavior: 'auto',
        inline: 'center'
      });
    }
  }, 200);
}
</script>

<template>
  <div v-if="loading" class="bg-slate-200 w-full h-full flex justify-center items-center">
    <div class="loader"></div>
  </div>
  <div class="w-full h-full bg-slate-200" v-else>
    <div class="w-full h-24 flex items-center justify-center text-4xl text-slate-600 border-b-2 border-gray-300 relative">
      DAILY SCHEDULE {{ days[dayID] }} {{ month }}/{{ day }}
      <RouterLink to="/">
        <div class="absolute top-3 left-5 text-slate-400" @click="currentPerson = null;"><arrow-uturn-left-icon class="w-16 h-16" /></div>
      </RouterLink>
    </div>
    <div class="w-full flex">
      <div class="flex flex-col justify-start w-60">
        <div class="w-full h-16 flex justify-center items-center text-gray-500 border-b-4 border-r-4 font-bold border-gray-300">NAME</div>
        <div class="w-full h-28 flex justify-start items-center p-3 bg-white border-r-4 border-b-4 gap-4 border-gray-300" v-for="(p, i) in people" :key="i">
          <div class="w-20 h-20 rounded-full overflow-hidden flex justify-center items-center" :style="'background-color: ' + p.color + ';'">
            <img :src="p.img" class="rounded-full w-full h-full">
          </div>
          <div class="font-bold text-2xl">{{ p.name }}</div>
        </div>
      </div>
      <div class="flex flex-col justify-start w-[calc(100%-15rem)]">
        <div class="w-full overflow-x-auto overflow-y-hidden" id="hoursWindow">
          <div class="w-fit h-16 flex justify-center items-center text-gray-500 font-bold border-gray-300 border-b-4 relative">
            <div class="border-x border-gray-300 w-40 h-full flex items-center justify-center" v-for="(h, i) in hours" :key="i">
              {{ h }}
            </div>
            <div class="absolute top-0 h-screen w-[3px] bg-slate-800 z-50" id="Arrow" :style="'left: ' + currentHours * 10 + 'rem;'">
              <div class="absolute -top-4 -left-[15px] text-slate-800 text-4xl">▾</div>
            </div>
          </div>
          <div class="w-fit h-28 flex justify-start items-center bg-white border-b-4 border-gray-300 relative" v-for="(p, i) in people" :key="i">
            <div class="w-40 h-28" v-for="(h, i) in hours" :key="i"></div>
            <div class="absolute w-full h-full">
              <div v-for="(s, index) in p.schedule" :key="index" class="h-24 absolute top-[6px] rounded text-white flex text-center justify-center items-center break-words border-x-2 border-white border-opacity-20" :style="'left: ' + s.start * 10 + 'rem; width: ' + (s.end - s.start) * 10 + 'rem; background-color: ' + p.color + ';'">
                {{ s.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
