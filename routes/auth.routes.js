const express = require("express");
const router = express.Router();

//we installed bcrypt.js
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

const {
  isLoggedIn,
  isLoggedOut,
} = require("../middlewares/session.middleware");

router.post("/signup", (req, res) => {
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
  UserModel.create({ name: username, email, passwordHash: hash, friends: [] })
    .then((user) => {
      // ensuring that we don't share the hash as well with the user
      user.passwordHash = "***";
      res.status(200).json(user);
    })
    .catch((err) => {
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
    });
});

// will handle all POST requests to http:localhost:5005/api/signin
router.post("/signin", (req, res) => {
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

  // Find if the user exists in the database
  UserModel.findOne({ email })
    .then((userData) => {
      //check if passwords match
      bcrypt
        .compare(password, userData.passwordHash)
        .then((doesItMatch) => {
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            //session is the user that is using your app
            userData.passwordHash = "***";
            req.session.loggedInUser = userData;
            res.status(200).json(userData);
          }
          //if passwords do not match
          else {
            res.status(500).json({
              error: "Passwords don't match",
            });
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "Email format not correct",
          });
          return;
        });
    })
    //throw an error if the user does not exists
    .catch((err) => {
      res.status(500).json({
        error: "Email does not exist",
        message: err,
      });
      return;
    });
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

// will handle all POST requests to http:localhost:5005/api/logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  // Nothing to send back to the user
  res.status(204).json({});
});

// THIS IS A PROTECTED ROUTE
// will handle all get requests to http:localhost:5005/api/user
router.get("/user", isLoggedIn, (req, res, next) => {
  console.log("/user ", req.session.loggedInUser);
  res.status(200).json(req.session.loggedInUser);
});

module.exports = router;
