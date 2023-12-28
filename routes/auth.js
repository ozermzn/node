const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/register", authController.getRegister);
router.post("/signup", authController.postRegister);
router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);

module.exports = router;
