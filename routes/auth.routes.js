const express = require("express");
const router = express.Router();

//we installed bcrypt.js
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

  // NOTE: We have used the Sync methods here.
  // creating a salt
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
        errorMessage: "username or email entered already exists!",
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

  // -----SERVER SIDE VALIDATION ----------
  /*
    if ( !email || !password) {
        res.status(500).json({
            error: 'Please enter Username. email and password',
       })
      return;  
    }
    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
            error: 'Email format not correct',
        })
        return;  
    }
    */
  try {
    // Find if the user exists in the database
    let foundUser = await UserModel.findOne({ email });
    //check if passwords match
    try {
      let doesItMatch = await bcrypt.compare(password, foundUser.passwordHash);
      //if password matches
      if (doesItMatch) {
        // req.session is the special object that is available to you
        //session is the user that is using your app
        foundUser.passwordHash = "***";
        req.session.loggedInUser = foundUser;
        res.status(200).json(foundUser);
      }
      //if passwords do not match
      else {
        res.status(500).json({
          error: "Password doesn't match",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Email format not correct",
      });
      return;
    }
  } catch (err) {
    res.status(500).json({
      error: "Email does not exist",
      message: err,
    });
    return;
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
  // Nothing to send back to the user
  res.status(204).json({});
});

// THIS IS A PROTECTED ROUTE
// will handle all get requests to http:localhost:5005/api/user
router.get("/user", isLoggedIn, async (req, res) => {
  let currentUser = await UserModel.findById(
    req.session.loggedInUser._id
  ).populate("friends");
  //console.log("current user, /user", currentUser);
  res.status(200).json(currentUser);
});

module.exports = router;
