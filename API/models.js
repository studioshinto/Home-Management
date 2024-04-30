const mongoose = require("mongoose")

module.exports = mongoose.model("Person", mongoose.Schema({
    personID: Number,
    name: String,
    img: String,
    color: String,
    creditStored: Number,
    isAdmin: Boolean,
    passcode: Number,
}))

module.exports = mongoose.model("ChoreLog", mongoose.Schema({
    personID: Number,
    dateCreated: Date,
}))

module.exports = mongoose.model("Chore", mongoose.Schema({
    choreID: Number,
    name: String,
    img: String,
    assignedTo: Number,
    subtasks: Array
}))

module.exports = mongoose.model("ExtraCredit", mongoose.Schema({
    extraCreditID: Number,
    name: String,
    img: String,
    value: Number,
    assignedTo: Number,
    lastClaimed: Date,
    refreshRate: Number,
}))

module.exports = mongoose.model("ScheduleItem", mongoose.Schema({
    day: Number,
    name: String,
    start: Number,
    end: Number,
    assignedTo: Number
}))

module.exports = mongoose.model("CalendarItem", mongoose.Schema({
    id: String,
    startDate: Date,
    endDate: Date,
    title: String,
    classes: Array
}))

module.exports = mongoose.model("Holiday", mongoose.Schema({
    date: Date,
    name: String,
    countdown: Boolean,
    countdownLength: Number
}))