const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStretegy = require("passport-github2").Strategy;
const User = require("./models/User");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const port = process.env.PORT || 3000;

connectDB();


app.use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }));
app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
      sameSite: "lax",
    },
  }),
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(
  new GitHubStretegy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            firstName: profile.displayName || "Name",
            username: profile.username || "Username",
            email: profile.profileUrl,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/", require("./routes/auth"));

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    req.session.save();
    res.redirect("/");
  },
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/recipes", require("./routes/recipes"));
app.use("/tags", require("./routes/tags"));
app.use("/mealplans", require("./routes/mealPlan"));

app.get("/", (req, res) => {
  res.send("Recipe & Meal Planner API is running");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;