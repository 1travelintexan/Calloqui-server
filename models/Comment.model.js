const mongoose = require("mongoose");

let CommentSchema = new mongoose.Schema({
  description: String,
});

let CommentModel = mongoose.model("commentModel", EventSchema);

module.exports = CommentModel;
