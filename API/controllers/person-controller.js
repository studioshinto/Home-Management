var mongoose = require("mongoose"),
  Person = mongoose.model("Person");

exports.addNewPerson = async function (req, res) {
  try {
    var newPerson = await new Person(req.body);
    return res.json(newPerson);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getAllPeople = async function (req, res) {
  try {
    var allPeople = await Person.find({});
    return res.json(allPeople);
  } catch (error) {
    return res.status(500).json(error);
  }
};
