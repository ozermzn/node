const Product = require("../models/product");
const mongodb = require("mongodb");
exports.getAddProduct = (req, res, next) => {

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/edit-product",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const userID = req.user._id;

  const product = new Product({ title, price, description, imageUrl, userID });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/product-list");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId).then((product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productID = req.body.productID;
  const newTitle = req.body.title;
  const newImageUrl = req.body.imageUrl;
  const newDescription = req.body.description;
  const newPrice = req.body.price;
  Product.findById(productID)
    .then((product) => {
      product.title = newTitle;
      product.price = newPrice;
      product.description = newDescription;
      product.imageUrl = newImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/product-list");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productId;
  Product.findByIdAndDelete(productID)
    .then((result) => {
      console.log("Item was deleted!");
      console.log(result);
    })
    .catch((err) => console.log(err));
  res.redirect("/admin/product-list");
};

exports.getAdminProducts = (req, res, next) => {
  const userId = req.user._id;
  Product.find({ userID: userId }).then((products) => {
    res.render("admin/product-list", {
      products: products,
      path: "/product-list",
      pageTitle: "Admin Products",
      isLoggedIn: req.session.isLoggedIn,
    });
  });
};
