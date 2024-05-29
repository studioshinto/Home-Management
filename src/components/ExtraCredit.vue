<script setup>
import { ref } from 'vue'
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';

</script>

<template>
  <div class="w-full h-full bg-slate-200">
    <div class="w-full h-24 flex items-center justify-center text-4xl text-slate-480 absolute">
      EXTRA CREDIT
      <RouterLink to="/">
        <div class="absolute top-3 left-5 text-slate-400" @click="currentPerson = null;"><arrow-uturn-left-icon class="w-12 h-12" /></div>
      </RouterLink>
    </div>
  </div>
</template>
