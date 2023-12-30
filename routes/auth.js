const express = require("express");
const expressValid = require("express-validator/");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/register", authController.getRegister);
router.post(
  "/signup",
  expressValid.check("email").isEmail().withMessage("Geçersiz email adresi."),
  authController.postRegister
);
router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);
router.get("/reset/:token", authController.getNewPassword);

module.exports = router;
