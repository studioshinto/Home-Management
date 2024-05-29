<script setup>
import { ref, onMounted, KeepAlive } from "vue";
import { RouterView } from 'vue-router';
import { storeToRefs } from "pinia";
import { globalStore } from "./store/globals.ts";
import axios from "axios";

const globals = globalStore();
const { apiURL, people, dayID, year, month, day } = storeToRefs(globals);

apiURL.value = 'https://home-management-api-4cjc.onrender.com/'

var dataLoading = ref(true);

onMounted(() => {
  if (window.location.host.startsWith("localhost")) {
    apiURL.value = 'http://localhost:5000/';
  }
  keepAlive();
  getAllPeople();
  getCurrentDate();
})
//keep the hosted service alive
async function keepAlive() {
  axios.get(apiURL.value + "keepAlive");
  setTimeout(() => { keepAlive() }, 60000);
}

function getCurrentDate() {
  const date = new Date();
  dayID.value = date.getDay();
  month.value = date.getUTCMonth() + 1;
  day.value = date.getUTCDate();
  year.value = date.getFullYear();
  //check again every hour
  setTimeout(() => {
    var hours = date.getHours();
    if (hours == 0) {
      location.reload();
    }
    getCurrentDate();
  }, 3600000);
}

async function getAllPeople() {
  const res = await axios.get(apiURL.value + "person/all");
  res.data.forEach(p => {
    p.schedule = [];
  });
  people.value = res.data;
  dataLoading.value = false;
}
</script>

<template>
  <!-- Loader -->
  <div class="w-full h-full flex justify-center items-center bg-slate-200" v-if="dataLoading">
    <div class="loader"></div>
  </div>
  <RouterView v-else />
</template>
