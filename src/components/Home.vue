<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CalendarIcon, CalendarDaysIcon, StarIcon, SparklesIcon } from '@heroicons/vue/24/outline';

</script>

<template>
  <div class="w-full text-center text-slate-700 text-7xl absolute top-14 left-0 bg-slate-200">Home Management Portal</div>
  <div class="w-full h-full bg-slate-200 flex items-center justify-evenly">
    <RouterLink to="/schedule">
      <div class="w-64 h-64 border-2 border-primary-text flex flex-wrap justify-center content-center gap-5 rounded-lg text-primary-text">
        <calendar-icon class="w-16 text-indigo-500" />
        <div class="text-3xl w-full text-center">Schedule</div>
      </div>
    </RouterLink>
    <RouterLink to="/chores">
      <div class="w-64 h-64 border-2 border-primary-text flex flex-wrap justify-center content-center gap-5 rounded-lg text-primary-text">
        <sparkles-icon class="w-16 text-indigo-500" />
        <div class="text-3xl w-full text-center">Chores</div>
      </div>
    </RouterLink>
    <RouterLink to="/calendar">
      <div class="w-64 h-64 border-2 border-primary-text flex flex-wrap justify-center content-center gap-5 rounded-lg text-primary-text">
        <calendar-days-icon class="w-16 text-indigo-500" />
        <div class="text-3xl w-full text-center">Calendar</div>
      </div>
    </RouterLink>
    <RouterLink to="/extra-credit">
      <div class="w-64 h-64 border-2 border-primary-text flex flex-wrap justify-center content-center gap-5 rounded-lg text-primary-text">
        <star-icon class="w-16 text-indigo-500" />
        <div class="text-3xl w-full text-center">Extra Credit</div>
      </div>
    </RouterLink>
  </div>
</template>