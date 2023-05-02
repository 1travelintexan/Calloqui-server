const express = require("express");
const router = express.Router();
const uploader = require("../config/cloudinary.config.js");

const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

const {
  isLoggedIn,
  isLoggedOut,
} = require("../middlewares/session.middleware");

router.post("/signup", isLoggedOut, async (req, res) => {
  const { username, email, password } = req.body;

  // -----SERVER SIDE VALIDATION ----------
  /* 
    if (!username || !email || !password) {
        res.status(500)
          .json({
            errorMessage: 'Please enter username, email and password'
          });
        return;  
    }
    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
          errorMessage: 'Email format not correct'
        });
        return;  
    }
    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    if (!myPassRegex.test(password)) {
      res.status(500).json({
        errorMessage: 'Password needs to have 8 characters, a number and an Uppercase alphabet'
      });
      return;  
    }
    */
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  try {
    let newUser = await UserModel.create({
      name: username,
      email,
      passwordHash: hash,
      friends: [],
    });
    // ensuring that we don't share the hash as well with the user
    newUser.passwordHash = "***";
    res.status(200).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({
        errorMessage: "Username or Email entered already exists",
        message: err,
      });
    } else {
      res.status(500).json({
        errorMessage: "Something went wrong! Go to sleep!",
        message: err,
      });
    }
  }
});

// will handle all POST requests to http:localhost:5005/api/signin
router.post("/signin", isLoggedOut, async (req, res) => {
  const { email, password } = req.body;
  try {
    let foundUser = await UserModel.findOne({ email });
    if (foundUser) {
      let doesItMatch = await bcrypt.compare(password, foundUser.passwordHash);
      if (doesItMatch) {
        foundUser.passwordHash = "***";
        req.session.loggedInUser = foundUser;
        res.status(200).json(foundUser);
      } else {
        res.status(500).json({
          error: "Incorrect Password",
        });
      }
    } else {
      res.status(500).json({
        error: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/friend/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const friend = await UserModel.findById(id);
    res.status(200).json(friend);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/friend/add/:friendId", async (req, res) => {
  const { friendId } = req.params;
  const userId = req.session.loggedInUser._id;
  try {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { friends: friendId },
      }
    );
    let userWithNewFriend = await UserModel.findById(userId).populate(
      "friends"
    );
    res.status(201).json(userWithNewFriend);
  } catch (err) {
    console.log("error adding your friend", err);
  }
});

//route to remove friend from DB
router.get("/friend/remove/:friendId", async (req, res) => {
  const { friendId } = req.params;
  const userId = req.session.loggedInUser._id;
  try {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { friends: friendId },
      }
    );
    let userWithfriendRemoved = await UserModel.findById(userId).populate(
      "friends"
    );
    res.status(201).json(userWithfriendRemoved);
  } catch (err) {
    console.log("error adding your friend", err);
  }
});
// will handle all POST requests to http:localhost:5005/api/logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  console.log("here", req.session);
  res.status(204).json({});
});

router.get("/user", isLoggedIn, async (req, res) => {
  let currentUser = await UserModel.findById(
    req.session.loggedInUser._id
  ).populate("friends");
  //console.log("current user, /user", currentUser);
  // console.log("here is the user session", req.session);
  res.status(200).json(currentUser);
});

router.post("/avatar/:id", uploader.single("imageUrl"), (req, res) => {
  let id = req.params.id;
  const avatar = req.file.path;
  console.log("avatar route", id, req.file);
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
