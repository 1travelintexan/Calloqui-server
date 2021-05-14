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
      res.status(200).json(response);
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
router.get("/comment/:commentId", (req, res) => {
  CommentModel.findById(req.params.commentId)
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
