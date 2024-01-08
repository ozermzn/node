const Product = require("../models/product");
const mongodb = require("mongodb");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/edit-product",
    editing: false,
    errorMessage: [],
    oldInput: {
      title: "",
      imageUrl: "",
      description: "",
      price: null,
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  const userID = req.user._id;
  const errors = validationResult(req);
  res.redirect("/admin/add-product");
  return console.log(image);
  const a = errors.array().find((e) => e);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      path: "/edit-product",
      pageTitle: "Add Product",
      errorMessage: errors.array(),
      editing: false,
      oldInput: { title, image, description, price },
    });
  }
  const product = new Product({
    title,
    price,
    description,
    image,
    userID,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/product-list");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
      errorMessage: [],
      oldInput: {
        newTitle: "",
        newImageUrl: "",
        newDescription: "",
        newPrice: null,
      },
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productID = req.body.productID;
  const newTitle = req.body.title;
  const newImageUrl = req.body.imageUrl;
  const newDescription = req.body.description;
  const newPrice = req.body.price;
  const errors = validationResult(req);
  const a = errors.array().find((e) => e);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      path: "/edit-product",
      pageTitle: "Edit Product",
      errorMessage: errors.array(),
      editing: true,
      product: {
        title: newTitle,
        imageUrl: newImageUrl,
        description: newDescription,
        price: newPrice,
      },
    });
  }
  Product.findById(productID)
    .then((product) => {
      if (product.userID.toString() !== req.user._id.toString()) {
        return;
      }
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productId;

  Product.deleteOne({ _id: productID, userID: req.session.user._id })
    .then((result) => {
      console.log("Item was deleted!");
      console.log(result);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  res.redirect("/admin/product-list");
};

exports.getAdminProducts = (req, res, next) => {
  const userId = req.user._id;

  Product.find({ userID: userId }).then((products) => {
    res.render("admin/product-list", {
      products: products,
      path: "/product-list",
      pageTitle: "Admin Products",
    });
  });
};
