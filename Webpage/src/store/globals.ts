import { defineStore } from "pinia";

export const globalStore = defineStore("globals", {
  state: () => ({
    currentUser: null,
    apiURL: "",
    loginRedirect: "",
    showError: "",
    adminPasscode: "9833",

    people: [
      { personID: 1, name: "Mitch", img: "", color: "#2cc7ff", creditStored: 0, schedule: [] },
      { personID: 2, name: "Anissa", img: "", color: "#7ea97f", creditStored: 0, schedule: [] },
      { personID: 3, name: "Olivia", img: "", color: "#af94f5", creditStored: 0, schedule: [] },
      { personID: 4, name: "Lily", img: "", color: "#13e3d8", creditStored: 0, schedule: [] },
      { personID: 4, name: "Juniper", img: "", color: "#dd84ae", creditStored: 0, schedule: [] },
      { personID: 4, name: "Hannah", img: "", color: "#0d593e", creditStored: 0, schedule: [] },
      { personID: 4, name: "Adeline", img: "", color: "#d78432", creditStored: 0, schedule: [] },
    ],
    days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    hours: ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"],
    dayID: 0,
    month: 0,
    day: 0,
  }),
});
