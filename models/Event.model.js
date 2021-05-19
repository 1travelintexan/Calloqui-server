const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

let EventSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  date: String,
  location: String,
  shaka: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

let EventModel = mongoose.model("event", EventSchema);

module.exports = EventModel;
