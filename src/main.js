import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import {createPinia} from "pinia";
import "./style.css";
import App from './App.vue'

import Home from './components/Home.vue'
import Schedule from './components/Schedule.vue'
import ScheduleEdit from './components/ScheduleEdit.vue'
import Chores from './components/Chores.vue'
import ChoresEdit from './components/ChoresEdit.vue'
import Calendar from './components/Calendar.vue'
import ExtraCredit from './components/ExtraCredit.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/schedule', component: Schedule },
    { path: '/schedule/edit', component: ScheduleEdit },
    { path: '/chores', component: Chores},
    { path: '/chores/edit', component: ChoresEdit},
    { path: '/calendar', component: Calendar },
    { path: '/extra-credit', component: ExtraCredit },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia();
createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
