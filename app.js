// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);
require("./config/session.config")(app);

//set up and connect mongo
const session = require("express-session");
const MongoStore = require("connect-mongo");
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1";

//if you are looing for  static files then they are in the public folder
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// 👇 Start handling routes here
// Contrary to the views version, all routes are controled from the routes/index.js
const allRoutes = require("./routes");
app.use("/api", allRoutes);

//What I added for my event routes
const eventRoutes = require("./routes/event.routes");
app.use("/api", eventRoutes);

//linking the auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

//linking the cloudinary routes
const cloudinaryRoutes = require("./routes/file-upload.routes");
app.use("/api", cloudinaryRoutes);

// linking the comment routes
const commentRoutes = require("./routes/comment.routes");
app.use("/api", commentRoutes);

// linking the chat routes
const chatRoutes = require("./routes/chat.routes");
app.use("/chat", chatRoutes);
//if the user visits a page that is not in the browser, then the path will come here
app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
