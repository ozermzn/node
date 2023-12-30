const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "SG.ksJqkK6rTSyg12Qbd7DSYQ.pt9t0kyOs4STS-A23Htd4effH2Cw5Sd4KH0OH-se9Kg",
    },
  })
);

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[2].trim().split("=")[1];
  let message = req.flash("error");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message.length > 0 ? (message = message[0]) : null,
  });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email.");
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          if (err) console.log(err);
          res.redirect("/");
        });
      } else {
        req.flash("error", "Invalid password.");
        res.redirect("/login");
      }
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
  let message = req.flash("error");
  res.render("auth/register", {
    path: "/register",
    pageTitle: "Register",
    errorMessage: message.length > 0 ? message : null,
  });
};

exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/register", {
      path: "/regiser",
      pageTitle: "Register",
      errorMessage: errors.array().map((i) => i.msg),
    });
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email exist already!");
        return res.redirect("/register");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            name,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "ozer.ramazan@outlook.com.tr",
            subject: "Kayıt Başarılı!",
            html: "<h1>Bravo</h1>",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message.length > 0 ? message : null,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.token = token;
        user.tokenExpriation = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "ozer.ramazan@outlook.com.tr",
          subject: "Reset your password",
          html: `
          <p>You requested password reset.</p>
          <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password. </p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ token: token })
    .then((user) => {
      console.log(user);
      let message = req.flash("error");
      res.render("auth/new-password", {
        pageTitle: "Reset Password",
        path: "/new-password",
        userID: user._id.toString(),
        errorMessage: message.length > 0 ? message : null,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
