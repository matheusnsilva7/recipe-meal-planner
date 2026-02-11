const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.firstName}`
      : "Logged out",
  );
});

router.get("/login", passport.authenticate("github"), (req, res) => {});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


module.exports = router;
