// require session
const session = require("express-session");
const MongoStore = require("connect-mongo");
module.exports = (app) => {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: "MysuperSecret",
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
          "mongodb+srv://kook-club-main-db-005fbb78337:NwbnyK2BsjxgkBTFCP1vFTbBnkRFp1@prod-us-central1-2.ih9la.mongodb.net/kook-club-main-db-005fbb78337" ||
          "mongodb://localhost/Kook-Club",
        //ttl => time to live
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
