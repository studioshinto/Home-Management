<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { globalStore } from "../../store/globals.ts";

const globals = globalStore();
const { adminPasscode } = storeToRefs(globals);

const emit = defineEmits(["authenticated"]);

var passcodeInput = ref("");
var passcodeWrong = ref(false);

var numbers = ref(["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0", "⇦"]);

const passcodeStars = computed(() => {
  var stars = "";
  for (let i = 0; i < passcodeInput.value.length; i++) {
    stars += "*";
  }
  return stars;
});

function numPressed(n) {
  if (n == " ") {
    //Do nothing
  } else if (n == "⇦") {
    passcodeInput.value = passcodeInput.value.substring(0, passcodeInput.value.length - 1);
  } else {
    passcodeInput.value += n;
  }
}

function checkPassword() {
  if (passcodeInput.value == adminPasscode.value) {
    emit("authenticated");
  } else {
    passcodeWrong.value = true;
    setTimeout(() => {
      passcodeWrong.value = false;
    }, 3000);
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center bg-slate-200">
    <div class="w-96 text-center text-4xl mb-10">Enter Admin Passcode</div>
    <div class="w-64">
      <div class="w-full h-16 bg-slate-300 rounded flex justify-center items-center mb-3 text-4xl tracking-widest" :class="{ 'bg-red-400 text-white text-lg': passcodeWrong }">{{ passcodeWrong ? "Incorrect Passcode" : passcodeStars }}</div>
      <div class="flex flex-wrap gap-2">
        <div class="w-20 h-20 flex justify-center items-center text-white rounded text-2xl font-bold active:bg-slate-600" :class="n == ' ' ? 'bg-slate-200' : 'bg-slate-500'" v-for="n in numbers" :key="n" @click="numPressed(n)">{{ n }}</div>
      </div>
      <div class="h-16 w-full bg-indigo-400 text-white text-2xl flex justify-center items-center mt-4 rounded" @click="checkPassword()">Submit</div>
    </div>
  </div>
</template>
