const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator");
router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
  "/add-product",
  [
    check("title").isLength({ min: 3 }).withMessage("Too short!").trim(),
    check("description")
      .isLength({ min: 6, max: 255 })
      .withMessage("Please, write description between 6-255 characters.")
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);
router.get("/product-list", isAuth, adminController.getAdminProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  isAuth,
  [
    check("title").isLength({ min: 3 }).withMessage("Too short!").trim(),
    check("description")
      .isLength({ min: 6, max: 205 })
      .withMessage("Please, write description between 6-200 words.")
      .trim(),
  ],
  adminController.postEditProduct
);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
