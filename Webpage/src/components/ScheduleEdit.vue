<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from "pinia";
import { globalStore } from "../store/globals.ts";
import Authenticator from './modules/Authenticator.vue';

const globals = globalStore();
const { people } = storeToRefs(globals);

var authenticated = ref(false);

</script>

<template>
  <div v-if="authenticated" class="bg-slate-200 w-full h-full flex justify-center items-center">
    <div class="loader"></div>
  </div>
  <Authenticator v-else @authenticated="() => authenticated = true" />
</template>
