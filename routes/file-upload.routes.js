const express = require("express");
const router = express.Router();

// include CLOUDINARY:
const uploader = require("../config/cloudinary.config.js");

router.patch("/upload", uploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);
  if (!req.file) {
    res.status(200).json({ message: "no image" });
  } else {
    //You will get the image url in 'req.file.path'
    //store that in the DB
    res.status(200).json({
      image: req.file.path,
    });
  }
});

module.exports = router;
