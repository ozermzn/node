const Products = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const user = require("../models/user");
const { getAdminProducts } = require("./admin");

exports.getProducts = (req, res, next) => {
  Products.find().then((products) => {
    console.log(products);
    res.render("shop/products", {
      products: products,
      path: "/shop",
      pageTitle: "Shop",
    });
  });
};
exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Products.findById(productId).then((product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: product?.title,
    });
  });
};
exports.getIndex = (req, res, next) => {
  Products.find().then((products) => {
    console.log(products);
    res.render("shop/index", {
      products: products,
      path: "/",
      pageTitle: "Home",
    });
  });
};
exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productID").then((user) => {
    const products = user.cart.items;
    return res.render("shop/cart", {
      products,
      path: "/cart",
      pageTitle: "Cart",
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Products.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      throw new Error(err);
    });
};

exports.deleteCartItem = (req, res, next) => {
  const productID = req.body.productId;
  req.user
    .deleteCartItemByID(productID)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productID")
    .then((user) => {
      const products = user.cart.items.map((product) => {
        return {
          quantity: product.quantity,
          product: { ...product.productID._doc },
        };
      });
      const order = new Order({
        user: {
          username: req.user.name,
          userID: req.user._id,
        },
        products: products,
      });

      order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrder = (req, res, next) => {
  Order.find({ "user.userID": req.user._id }).then((orders) => {
    res.render("shop/orders", {
      path: "/shop/orders",
      pageTitle: "Orders",
      order: orders.reverse(),
    });
  });
};
