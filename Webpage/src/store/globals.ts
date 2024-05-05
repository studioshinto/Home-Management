import {defineStore} from "pinia";

export const globalStore = defineStore("globals", {
	state: () => ({
		currentUser: null,
		apiURL: "",
		loginRedirect: "",
		showError: "",
		adminPasscode: "9833",

		people: [
			{personID: 1, name: "Mitch", img: "", color: "#2cc7ff", creditStored: 0},
			{personID: 2, name: "Anissa", img: "", color: "#7ea97f", creditStored: 0},
			{personID: 3, name: "Olivia", img: "", color: "#af94f5", creditStored: 0},
			{personID: 4, name: "Lily", img: "", color: "#13e3d8", creditStored: 0},
			{personID: 4, name: "Juniper", img: "", color: "#dd84ae", creditStored: 0},
			{personID: 4, name: "Hannah", img: "", color: "#0d593e", creditStored: 0},
			{personID: 4, name: "Adeline", img: "", color: "#d78432", creditStored: 0},
		]
	}),
});
