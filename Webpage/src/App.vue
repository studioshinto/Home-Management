<script setup>
import { ref, onMounted } from "vue";
import { RouterView } from 'vue-router';
import { storeToRefs } from "pinia";
import { globalStore } from "./store/globals.ts";
import axios from "axios";

const globals = globalStore();
const { apiURL, people } = storeToRefs(globals);

apiURL.value = 'http://localhost:5000/'

var dataLoading = ref(true);

onMounted(() => {
  getAllPeople();
})

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
