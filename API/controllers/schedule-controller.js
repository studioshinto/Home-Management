var mongoose = require("mongoose"),
Schedule = mongoose.model("Schedule");

exports.addUpdateSchedule = async function (req, res) {
  try {
    //check if a schedule already exists
    var query = {day: req.body.day, assignedTo: req.body.assignedTo};
    var result = await Schedule.findOne(query);
    var schedule = null;
    if(result){
      // if so update it 
      schedule = await Schedule.findOneAndUpdate(query, req.body, {new: true})
    }else{
      // Otherwise create a new one
      schedule = new Schedule(req.body);
      schedule = await schedule.save();
    }
    return res.json(schedule);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getSchedule = async function (req, res) {
  try {
    //start query with only the day param
    var query = { day: req.query.day };
    //if assigned to was also passed, add that to the query
    if(req.query.assignedTo){
      query.assignedTo = req.query.assignedTo;
    }
    var result = await Schedule.find(query);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};
