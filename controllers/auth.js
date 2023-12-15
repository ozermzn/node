const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[2].trim().split("=")[1];

  res.render("auth/login", {
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

exports.getRegister = (req, res, next) => {
  res.render("auth/register", {
    path: "/register",
    pageTitle: "Register",
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) return res.redirect("/");

      const user = new User({ email, name, password, cart: { items: [] } });
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/login");
    })

    .catch((err) => console.log(err));
};
