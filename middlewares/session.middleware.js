// middleware to check if user is loggedIn
const isLoggedIn = (req, res, next) => {
  //req.session.loggedInUser is
  if (req.session.loggedInUser) {
    //calls whatever is to be executed after the isLoggedIn function is over
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

// middleware to check if user is logged out
const isLoggedOut = (req, res, next) => {
  //req.session.loggedInUser is
  if (!req.session.loggedInUser) {
    //calls whatever is to be executed after the isLoggedIn function is over
    next();
  } else {
    res.status(401).json({
      message: "You are not logged out",
      code: 401,
    });
  }
};

module.exports = { isLoggedIn, isLoggedOut };
