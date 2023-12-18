const path = require("path");
const express = require("express");
const router = express.Router();
const rootDir = require("../util/path");
const adminProducts = require("./admin");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.get("/orders", isAuth, shopController.getOrder);
router.post("/create-order", isAuth, shopController.postOrder);
router.post("/delete-cart-item", isAuth, shopController.deleteCartItem);

module.exports = router;
