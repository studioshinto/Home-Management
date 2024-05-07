const express = require("express");
const mongoose = require("mongoose");
bodyParser = require('body-parser');

// App setup
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI || "mongodb+srv://svc-mongodb:FnC0AjZibZNfoeOx@homemanagement.vl2thsy.mongodb.net/";

var app = express();
const cors = require('cors');
var server;
Models = require("./models"); //created models loading here

// Static files
app.use(express.static("public"));

app.use(cors());

// Connect to MongoDB database
mongoose.connect(uri, { useNewUrlParser: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true, parameterLimit: 2000 }));

var routes = require('./routes'); //importing route
routes(app); //register the route


server = app.listen(PORT, function () { console.log(`http://localhost:${PORT}`); });