const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

let CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "event",
  },
});

let CommentModel = mongoose.model("comment", CommentSchema);

module.exports = CommentModel;
