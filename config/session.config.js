// require session
const session = require("express-session");
const MongoStore = require("connect-mongo");
module.exports = (app) => {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60000 * 60 * 24, // 60 * 1000 ms === 1 day
      },
      //<===========this is where we save the session into the DB!!!! ===============>
      store: MongoStore.create({
        mongoUrl:
          "mongodb+srv://kook-club-main-db-0411f02b523:nH35dSWKatGxYqCVE1TYjSnZZ7j5Xj@prod-us-central1-2.ih9la.mongodb.net/kook-club-main-db-0411f02b523" ||
          "mongodb://localhost/Kook-Club",
        //ttl => time to live
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
