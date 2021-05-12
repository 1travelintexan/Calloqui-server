const express = require("express");
const router = express.Router();
let EventModel = require("../models/Event.model");

// NOTE: All your API routes will start from /api

// will handle all GET requests to http:localhost:5005/api/todos
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

// will handle all POST requests to http:localhost:5005/api/create

router.post("/create", (req, res) => {
  const { name, description, date, location } = req.body;
  console.log(req.body);
  EventModel.create({
    name: name,
    description: description,
    date: date,
    location: location,
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

// will handle all GET requests to http:localhost:5005/api/todos/:todoId
//PS: Don't type :todoId , it's something dynamic,
router.get("/events/:eventId", (req, res) => {
  EventModel.findById(req.params.todoId)
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

// will handle all DELETE requests to http:localhost:5005/api/todos/:id
router.delete("/events/:id", (req, res) => {
  EventModel.findByIdAndDelete(req.params.id)
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

// will handle all PATCH requests to http:localhost:5005/api/todos/:id
router.patch("/events/:id", (req, res) => {
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

module.exports = router;
