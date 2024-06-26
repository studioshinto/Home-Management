import { defineStore } from "pinia";

export const globalStore = defineStore("globals", {
  state: () => ({
    currentUser: null,
    apiURL: "",
    loginRedirect: "",
    showError: "",
    adminPasscode: "9833",

    people: [],
    days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    hours: ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"],
    dayID: 0,
    year: 0,
    month: 0,
    day: 0,
  }),
});
