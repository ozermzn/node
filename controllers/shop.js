const Products = require("../models/product");
const User = require("../models/user");
exports.getProducts = (req, res, next) => {
  Products.find().then((products) => {
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
    res.render("shop/index", {
      products: products,
      path: "/",
      pageTitle: "Home",
    });
  });
};
exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    console.log(products);
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
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrder = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    for (let order of orders) {
      console.log(order);
      return res.render("shop/orders", {
        order,
        path: "/orders",
        pageTitle: "Orders",
      });
    }
  });
};
