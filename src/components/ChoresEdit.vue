<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { globalStore } from "../store/globals.ts";
import axios from "axios";
import { TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const globals = globalStore();
const { apiURL, people } = storeToRefs(globals);


const chores = ref([]);

const loading = ref(true);

const choreTotals = ref([]);


onMounted(() => {
  getChores();
});

async function getChores() {
  const res = await axios.get(apiURL.value + "chore");
  console.log(res.data);
  chores.value = res.data.allChores;
  chores.value.forEach(c => {
    c.expandSubtasks = false;
    c.saveText = "Save";
    selectAssignee(c);
  });
  console.log(chores.value);
  loading.value = false;
}

function selectAssignee(c) {
  var person = people.value.find(p => { return p._id == c.assignedTo })
  if (person) {
    c.customColor = 'background-color: ' + person.color + ';';
  } else {
    c.customColor = '';
  }
  updateChoreTotals();
}

function updateChoreTotals() {
  choreTotals.value = [];
  chores.value.forEach(ch => {
    if (ch.assignedTo) {
      var userFound = false;
      choreTotals.value.forEach(ct => {
        if (ct.id == ch.assignedTo) {
          ct.count++;
          userFound = true;
        }
      });
      if (!userFound) {
        choreTotals.value.push({ id: ch.assignedTo, name: people.value.find(p => { return p._id == ch.assignedTo }).name, count: 1 });
      }
    }
  });
}

function addSubtask(c) {
  c.subtasks.push({ name: "New Subtask", done: false });
}
function unassignAll() {
  chores.value.forEach(c => {
    c.assignedTo = 0;
    selectAssignee(c);
  });
}

function newChore() {
  chores.value.unshift({ name: "New Chore", img: "", assignedTo: null, expandSubtasks: false, saveText: "Save", subtasks: [{ name: "New Subtask", done: false }] });
}

async function saveAll() {
  var promiseArray = [];
  chores.value.forEach(c => {
    promiseArray.push(saveChore(c));
  });
  Promise.all(promiseArray).then((values) => {
    console.log(values);
  });
}

async function saveChore(c) {
  c.saveText = "Saving..";
  const res = await axios.post(apiURL.value + "chore", c);
  console.log(res);
  c.saveText = "Save";
}

function deleteSubtask(c, ii) {
  if (c.subtasks.length > 1) {
    c.subtasks.splice(ii, 1);
  } else {
    window.alert("You have to have at least 1 subtask per chore");
  }
}
</script>

<template>
  <div v-if="loading" class="bg-slate-200 w-full h-full flex justify-center items-center">
    <div class="loader"></div>
  </div>
  <div class="w-full h-full bg-slate-200" v-else>
    <div class="w-full h-24 flex items-center justify-center text-2xl text-slate-600">EDIT CHORES</div>
    <div class="w-full h-[calc(100vh-8rem)] flex flex-col items-center gap-3 overflow-y-auto">
      <div class="w-full max-w-5xl flex gap-2">
        <div class="rounded bg-slate-500 text-white px-2 py-1" v-for="(ct, i) in choreTotals" :key="i">{{ ct.name }}: {{ ct.count }}</div>
      </div>
      <div class="w-full max-w-5xl flex">
        <div class="flex w-1/3 justify-start">
          <div class="bg-indigo-400 text-white rounded px-5 py-1 cursor-pointer hover:bg-indigo-500" @click="unassignAll()">Unassign All</div>
        </div>
        <div class="flex w-1/3 justify-center">
          <div class="bg-indigo-400 text-white rounded px-5 py-1 cursor-pointer hover:bg-indigo-500" @click="newChore()">New Chore</div>
        </div>
        <div class="flex w-1/3 justify-end">
          <div class="bg-indigo-400 text-white rounded px-5 py-1 cursor-pointer hover:bg-indigo-500" @click="saveAll()">Save All</div>
        </div>
      </div>
      <div class="w-full max-w-5xl rounded-lg h-fit text-white p-2 flex flex-wrap justify-around gap-2" :class="{ 'bg-slate-500': !c.selectedPerson }" :style="c.customColor" v-for="(c, i) in  chores " :key="i">
        <input type="text" class="rounded-sm bg-white bg-opacity-10 p-1 w-96 outline-none flex-grow" v-model="c.name">
        <select v-model="c.assignedTo" class="rounded-sm bg-white bg-opacity-10 p-1 w-96 outline-none" @change="selectAssignee(c)">
          <option :value="null" class="text-slate-500">Unassigned</option>
          <option :value="p._id" v-for="(p, i) in people" :key="i" class="text-slate-500">{{ p.name }}</option>
        </select>
        <div class="rounded px-5 py-1 bg-white bg-opacity-15 cursor-pointer hover:bg-opacity-30" @click="saveChore(c)">{{ c.saveText }}</div>
        <div class="w-full flex flex-col items-center gap-2 overflow-hidden text-center leading-8" :class="c.expandSubtasks ? 'h-fit' : 'h-8'">
          <div class="w-full h-8 bg-white bg-opacity-0 hover:bg-opacity-15 cursor-pointer" @click="c.expandSubtasks = !c.expandSubtasks">Subtasks</div>
          <div class="w-full bg-white bg-opacity-10 relative h-8" v-for="( st, ii ) in  c.subtasks" :key="ii">
            <input type="text" v-model="st.name" class="w-full bg-white bg-opacity-10 outline-none px-2">
            <x-mark-icon class="absolute top-0 right-0 opacity-50 h-full hover:opacity-100 cursor-pointer" @click="deleteSubtask(c, ii)" />
          </div>
          <div class="rounded-full w-8 bg-white bg-opacity-15 text-xl font-bold cursor-pointer hover:bg-opacity-30" @click="addSubtask(c)">+</div>
        </div>
      </div>
    </div>
  </div>
</template>
