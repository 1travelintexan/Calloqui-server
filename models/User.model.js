const { Schema, model } = require("mongoose");

let UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatar: String,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

let UserModel = model("user", UserSchema);

module.exports = UserModel;
