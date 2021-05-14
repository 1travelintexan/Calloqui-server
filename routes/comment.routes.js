const express = require("express");
const router = express.Router();
let CommentModel = require("../models/Comment.model");

// will handle all POST requests to http:localhost:5005/api/create

router.post("/create", (req, res) => {
  const { description } = req.body;

  CommentModel.create({
    description,
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
//PS: Don't type :todoId , it's something dynamic,
router.get("/events/:eventId", (req, res) => {
  CommentModel.findById(req.params.eventId)
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
