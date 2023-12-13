const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[2].trim().split("=")[1];
  const isLoggedIn = true;
  console.log(req.session.isLoggedIn);
  res.render("shop/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: req.session.isLoggedIn,
  });
};
exports.postLogin = (req, res, next) => {
  User.findById("6568d847f5e3448cffe5a130").then((user) => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) console.log(err);
      res.redirect("/");
    });
  });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
