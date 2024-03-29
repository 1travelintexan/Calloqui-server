const express = require("express");
const router = express.Router();
let EventModel = require("../models/Event.model");
const ConversationModel = require("../models/Conversation.model");

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
  const { name, description, date, location, shaka } = req.body;
  console.log("here is the session from the create post", req.session);
  let image =
    "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHdhdmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";

  if (req.body.image) {
    image = req.body.image;
  }
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
      EventModel.findById(response._id).then((info) => {
        res.status(200).json(info);
      });
    })
    .catch((err) => {
      console.log("error creating event", err);
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
      console.log("single event", response);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log("failed to find single event", err);
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

//this is for the shaka update (likes)
// will handle all PATCH requests to http:localhost:5005/api/events/:id/shaka
router.patch("/event/:id/shaka", (req, res) => {
  let id = req.params.id;
  const owner = req.session.loggedInUser._id;

  // find the event then get the array of shakas, check if user is inside array
  let shaka = req.body.shaka;
  let unlike = shaka.includes(owner);

  EventModel.findByIdAndUpdate(
    id,
    unlike
      ? {
          $pull: {
            shaka: owner,
          },
        }
      : {
          $addToSet: {
            shaka: owner,
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
