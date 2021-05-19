const express = require("express");
const router = express.Router();
let EventModel = require("../models/Event.model");
let UserModel = require("../models/User.model");
const uploader = require("../config/cloudinary.config.js");

// NOTE: All your API routes will start from /api

// will handle all GET requests to http:localhost:5005/api/events
router.get("/events", (req, res) => {
  EventModel.find()
    .then((events) => {
      res.status(200).json(events);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// will handle all GET requests to http:localhost:5005/api/profile
router.get("/profile", (req, res) => {
  EventModel.find()
    .then((events) => {
      res.status(200).json(events);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// will handle all POST requests to http:localhost:5005/api/create

router.post("/create", (req, res) => {
  const { name, image, description, date, location, shaka } = req.body;
  const owner = req.session.loggedInUser._id;
  EventModel.create({
    name,
    image,
    description,
    date,
    location,
    shaka,
    owner,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// will handle all GET requests to http:localhost:5005/api/events/:eventId
//PS: Don't type :eventsId , it's something dynamic,
router.get("/event/:eventId", (req, res) => {
  EventModel.findById(req.params.eventId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// will handle all GET requests to http:localhost:5005/api/profile/:eventId
//PS: Don't type :eventsId , it's something dynamic,
router.get("/profile/:eventId", (req, res) => {
  EventModel.findById(req.params.eventId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// will handle all DELETE requests to http:localhost:5005/api/events/:id
router.delete("/profile/:eventId", (req, res) => {
  EventModel.findByIdAndDelete(req.params.eventId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// will handle all PATCH requests to http:localhost:5005/api/events/:id
router.patch("/event/:id", (req, res) => {
  let id = req.params.id;
  const { name, description, date, location } = req.body;
  EventModel.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
        description: description,
        date: date,
        location: location,
        shaka: Number,
      },
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

//avatar image route
// will handle all PATCH requests to http:localhost:5005/api/events/:id
router.patch("/avatar/:id", uploader.single("imageUrl"), (req, res) => {
  // let id = req.params.id;
  const avatar = req.file.path;
  const id = req.session.loggedInUser._id;

  UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        avatar: avatar,
      },
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});
module.exports = router;
