const express = require("express");
const errorController = require("../controllers/errors");
const router = express.Router();

router.get("error", errorController.getError404);
router.get("error", errorController.getError500);

module.exports = router;
