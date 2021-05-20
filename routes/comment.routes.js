const express = require("express");
const router = express.Router();
let CommentModel = require("../models/Comment.model");

// will handle all POST requests to http:localhost:5005/api/comment/create

router.post("/comment/:eventId/create", (req, res) => {
  const { comment } = req.body;
  const { eventId } = req.params;
  const owner = req.session.loggedInUser._id;

  CommentModel.create({
    comment,
    owner,
    eventId,
  })
    .then((response) => {
      CommentModel.findById(response._id)
        .populate("owner")
        .then((info) => {
          res.status(200).json(info);
        })
        .catch((err) => {
          res.status(500).json({
            error: "Something went wrong",
            message: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

// will handle all GET requests to http:localhost:5005/api/comments/:commentId
//PS: Don't type :todoId , it's something dynamic,
router.get("/comments/:commentId", (req, res) => {
  CommentModel.findById(req.params.commentId)
    .populate("owner")
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

//handle routes to get comments from db
router.get("/comments", (req, res) => {
  CommentModel.find()
    .populate("owner")
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;
