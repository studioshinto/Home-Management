var mongoose = require("mongoose"),
  Person = mongoose.model("Person");

exports.addNewPerson = async function (req, res) {
  try {
    var newPerson = new Person(req.body);
    await newPerson.save();
    return res.json(newPerson);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updatePerson = async function (req, res) {
  try {
    var person = await Person.findOneAndUpdate({"_id": req.params.personID}, req.body, {new: true})
    return res.json(person);
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
