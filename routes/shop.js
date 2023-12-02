const path = require("path");
const express = require("express");
const router = express.Router();
const rootDir = require("../util/path");
const adminProducts = require("./admin");
const shopController = require("../controllers/shop");
router.get("/", shopController.getIndex);
// router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
// router.get("/orders", shopController.getOrder);
// router.post("/create-order", shopController.postOrder);
// router.post("/delete-cart-item", shopController.deleteCartItem);

module.exports = router;
