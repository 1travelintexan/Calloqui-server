// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app
//localhost address mongodb://127.0.0.1/Kook-club";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1/Kook-Club";
mongoose
  .connect(MONGO_URI, { family: 4 })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
