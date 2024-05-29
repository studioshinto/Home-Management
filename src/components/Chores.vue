<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { globalStore } from "../store/globals.ts";
import axios from "axios";
import { CheckCircleIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';

const globals = globalStore();
const { apiURL, people, days, hours, dayID, month, day, year } = storeToRefs(globals);


const chores = ref([]);
const completions = ref([]);

const loading = ref(true);

const currentPerson = ref(null);

onMounted(() => {
  getChores();
});

const currentDate = computed(() => {
  var d = new Date;
  return d.toISOString().split("T")[0];
})


const currentHour = computed(() => {
  var d = new Date;
  return d.getHours();
})

async function getChores() {
  const res = await axios.get(apiURL.value + "chore?date=" + currentDate.value);
  chores.value = res.data.allChores;
  completions.value = res.data.todaysCompletions;
  loading.value = false;
}

function selectPerson(p) {
  p.completions = null;
  completions.value.forEach(c => {
    if (c.personID == p._id) {
      p.completions = c;
    }
  });
  if (!p.completions) { p.completions = { personID: p._id, morning: false, evening: false } }
  //check if the jobs are done right now
  p.noChores = true;
  var allDone = true;
  chores.value.forEach(c => {
    if (c.assignedTo == p._id) {
      p.noChores = false;
      c.subtasks.forEach(st => {
        if (!st.done) {
          allDone = false;
        }
      });
    }
  });
  //if so, check if they need to be reset for evening zones
  if (allDone && currentHour.value >= 14 && p.completions.morning) {
    chores.value.forEach(c => {
      if (c.assignedTo == p._id) {
        c.subtasks.forEach(st => { st.done = false; });
      }
    });
  }

  currentPerson.value = p;
}

async function checkAllDone() {
  var allDone = true;
  chores.value.forEach(c => {
    if (c.assignedTo == currentPerson.value._id) {
      c.subtasks.forEach(st => {
        if (!st.done) {
          allDone = false;
        }
      });
    }
  });
  if (allDone) {
    const res = await axios.get(apiURL.value + "chore/done/" + currentPerson.value._id + "?date=" + currentDate.value + "&evening=" + (currentHour.value >= 14));
    var completionFound = false;
    //update existing completions
    completions.value.forEach(c => {
      if (c.personID == currentPerson.value._id) {
        completionFound = true;
        currentHour.value >= 14 ? c.evening = true : c.morning = true;
        console.log(currentPerson.value.completions);
      }
    });
    if (!completionFound) {
      var comp = { personID: currentPerson.value._id, morning: false, evening: false }
      currentHour.value >= 14 ? comp.evening = true : comp.morning = true;
      completions.value.push(comp);
      currentPerson.value.completions = comp;
    }
  }
}
</script>

<template>
  <div v-if="loading" class="bg-slate-200 w-full h-full flex justify-center items-center">
    <div class="loader"></div>
  </div>
  <div class="w-full h-full bg-slate-200" v-else-if="currentPerson == null">
    <div class="w-full h-24 flex items-center justify-center text-4xl text-slate-480 absolute">
      DAILY CHORES {{ days[dayID] }} {{ month }}/{{ day }}
      <RouterLink to="/">
        <div class="absolute top-3 left-5 text-slate-400" @click="currentPerson = null;"><arrow-uturn-left-icon class="w-12 h-12" /></div>
      </RouterLink>
    </div>
    <div class="w-full h-full flex justify-center items-center">
      <div class="flex flex-wrap justify-evenly gap-5 w-full">
        <template v-for="(p, i) in people" :key="i">
          <div class="w-48 h-60 flex flex-col justify-evenly items-center" v-if="!p.parent" @click="selectPerson(p)">
            <div class="w-48 h-48 rounded-full overflow-hidden flex justify-center items-center" :style="'background-color: ' + p.color + ';'">
              <img :src="p.img" class="rounded-full w-full h-full">
            </div>
            <div class="font-bold text-2xl text-slate-800">{{ p.name }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div class="w-full h-full bg-slate-200" v-else>
    <div class="w-full h-20 flex items-center justify-center text-3xl text-slate-480 relative">
      <div class="absolute top-3 left-5 text-slate-400" @click="currentPerson = null;"><arrow-uturn-left-icon class="w-12 h-12" /></div>
      {{ currentPerson.name }}'s Tasks - {{ days[dayID] }} {{ month }}/{{ day }}
    </div>
    <div class="w-full text-4xl text-center mt-36" v-if="currentPerson.completions.morning && currentHour < 14">All done with chores for now</div>
    <div class="w-full text-4xl text-center mt-36" v-else-if="currentPerson.completions.evening">All done with chores for the day</div>
    <div class="w-full text-4xl text-center mt-36" v-else-if="currentPerson.noChores">You have no chores assigned</div>
    <div v-else class="w-full h-[calc(100%-5rem)] flex flex-col items-center overflow-y-auto">
      <template v-for="(c, i) in chores" :key="i">
        <div class="w-full max-w-2xl rounded-lg h-fit text-white text-xl p-4 mb-5" :style="'background-color: ' + currentPerson.color + ';'" v-if="c.assignedTo == currentPerson._id">
          <div class="w-full h-6 flex justify-center items-center">{{ c.name }}</div>
          <div class="w-full flex flex-col gap-2 mt-4">
            <div class="w-full flex justify-between bg-white bg-opacity-10 relative" v-for="(st, ii) in c.subtasks" :key="ii" @click="st.done = !st.done; checkAllDone();">
              <div class="w-full text-center leading-8 p-2">{{ st.name }}</div>
              <div class="h-8 w-8 rounded leading-8 absolute top-2 right-2"><check-circle-icon class="w-full" :class="st.done ? 'opacity-100' : 'opacity-15'" /></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
