<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { globalStore } from "../store/globals.ts";

const globals = globalStore();
const { people, days, hours, dayID, month, day } = storeToRefs(globals);

const currentHours = ref(0);

const scheduleItems = ref([
  { day: 3, name: "Morning Routine", start: 8.5, end: 9, assignedTo: 1 },
  { day: 3, name: "Work", start: 9, end: 17, assignedTo: 1 },
  { day: 3, name: "Girl's Time", start: 17, end: 18, assignedTo: 1 },
  { day: 3, name: "Dinner/Cleanup", start: 18, end: 19, assignedTo: 1 },
  { day: 3, name: "Projects", start: 19, end: 21, assignedTo: 1 },
  { day: 3, name: "Night Routine", start: 21, end: 22, assignedTo: 1 },
  { day: 3, name: "My Time", start: 22, end: 24, assignedTo: 1 },
]);

const loading = ref(true);

onMounted(() => {
  const date = new Date();
  dayID.value = date.getDay();
  month.value = date.getUTCMonth() + 1;
  day.value = date.getUTCDate();

  convertToScheduleObject();
  getCurrentTime();
});

function convertToScheduleObject() {
  people.value.forEach((s) => {
    s.schedule = [];
  });
  scheduleItems.value.forEach((si) => {
    people.value.forEach((s) => {
      if (si.assignedTo == s.personID) {
        s.schedule.push(si);
      }
    });
  });

  setTimeout(() => {
    loading.value = false;
  }, 2000);
}

function getCurrentTime() {
  var now = new Date();
  var hours = now.getHours();
  var mins = now.getMinutes();

  currentHours.value = hours + mins / 60;
  setTimeout(() => {
    getCurrentTime();
  }, 60000);
}
</script>

<template>
  <div v-if="loading" class="bg-slate-200 w-full h-full flex justify-center items-center">
    <div class="loader"></div>
  </div>
  <div class="w-full h-full bg-slate-200" v-else>
    <div class="w-full h-24 flex items-center justify-center text-4xl text-slate-600 border-b-2 border-gray-300 relative">
      DAILY SCHEDULE {{ days[dayID] }} {{ month }}/{{ day }}
      <RouterLink to="/schedule/edit" class="absolute top-5 right-5">
        <div class="py-2 px-5 rounded bg-indigo-500 text-white text-lg">Edit</div>
      </RouterLink>
    </div>
    <div class="w-full flex">
      <div class="flex flex-col justify-start w-60">
        <div class="w-full h-16 flex justify-center items-center text-gray-500 border-b-4 border-r-4 font-bold border-gray-300">NAME</div>
        <div class="w-full h-28 flex justify-start items-center p-3 bg-white border-r-4 border-b-4 gap-3 border-gray-300" v-for="(p, i) in people" :key="i">
          <div class="w-20 h-20 rounded-full" :style="'background-color: ' + p.color + ';'"></div>
          <div class="font-bold text-xl">{{ p.name }}</div>
        </div>
      </div>
      <div class="flex flex-col justify-start w-[calc(100%-15rem)]">
        <div class="w-full overflow-x-auto overflow-y-hidden">
          <div class="w-fit h-16 flex justify-center items-center text-gray-500 font-bold border-gray-300 border-b-4 relative">
            <div class="border-x border-gray-300 w-40 h-full flex items-center justify-center" v-for="(h, i) in hours" :key="i">
              {{ h }}
            </div>
            <div class="absolute top-0 h-screen w-[3px] bg-slate-800 z-50" :style="'left: ' + currentHours * 10 + 'rem;'">
              <div class="absolute -top-4 -left-[15px] text-slate-800 text-4xl">▾</div>
            </div>
          </div>
          <div class="w-fit h-28 flex justify-start items-center bg-white border-b-4 border-gray-300 relative" v-for="(p, i) in people" :key="i">
            <div class="w-40 h-28" v-for="(h, i) in hours" :key="i"></div>
            <div class="absolute w-full h-full">
              <div
                v-for="(s, index) in p.schedule"
                :key="index"
                class="h-24 absolute top-[6px] rounded text-white flex text-center justify-center items-center break-words border-x-2 border-white border-opacity-20"
                :style="'left: ' + s.start * 10 + 'rem; width: ' + (s.end - s.start) * 10 + 'rem; background-color: ' + p.color + ';'"
              >
                {{ s.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
