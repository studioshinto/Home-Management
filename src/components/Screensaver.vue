<script setup>
import { ref, onMounted } from "vue";

const day = ref(0);
const month = ref(0);
const year = ref(0);
const time = ref("");

onMounted(() => {
  getCurrentTime();
})

function getCurrentTime() {
  const date = new Date();

  month.value = date.getMonth() + 1;
  day.value = date.getDate();
  year.value = date.getFullYear();

  time.value = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  setTimeout(() => {
    getCurrentTime();
  }, 1000);
}


</script>

<template>
  <div class="w-full h-full bg-black text-white flex justify-center items-center text-4xl">
    <div class="flex gap-4">
      <div>{{ month }}/{{ day }}/{{ year }}</div>
      <div>{{ time }}</div>
    </div>
  </div>
</template>
