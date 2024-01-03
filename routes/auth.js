const express = require("express");
const { check, body } = require("express-validator/");
const router = express.Router();
const User = require("../models/user");
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Useless email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("We couldn`t find this email.");
          }
        });
      })
      .normalizeEmail(),
    body("password").isLength({ min: 5 }).withMessage("Very short!").trim(),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/register", authController.getRegister);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Geçersiz email adresi.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("This email used already!");
          }
        });
      })
      .normalizeEmail(),
    body("password").isLength({ min: 5 }).withMessage("Very short!").trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      })
      .trim(),
  ],
  authController.postRegister
);
router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);
router.get("/reset/:token", authController.getNewPassword);

module.exports = router;
