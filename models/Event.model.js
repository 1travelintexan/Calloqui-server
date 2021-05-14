const mongoose = require("mongoose");

let EventSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  date: String,
  location: String,
});

let EventModel = mongoose.model("surf-sess", EventSchema);

module.exports = EventModel;
