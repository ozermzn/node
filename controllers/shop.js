const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Products = require("../models/product");
const Order = require("../models/order");
const order = require("../models/order");
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

exports.getInvoice = (req, res, next) => {
  const orderID = req.params.orderId;
  Order.findById(orderID)
    .then((order) => {
      if (!order) return next(new Error("No order found!"));
      if (order.user[0].userID.toString() !== req.user._id.toString())
        return next(new Error("Unauthorized!"));
      const invoice = "invoice-" + orderID + ".pdf";
      const invoicePath = path.join("data", "invoices", invoice);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoice + '"'
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(22).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("--------------------------------------");
      let totalPrice = 0;
      order.products.forEach((p) => {
        totalPrice += totalPrice + p.quantity * p.product.price;
        pdfDoc
          .fontSize(15)
          .text(
            `${p.product.title} - ${p.quantity} piece x ${p.product.price}$`
          );
      });
      pdfDoc.text("----------");
      pdfDoc.fontSize(20).text(`Total Price: ${totalPrice}$`);
      pdfDoc.end();
    })
    .catch((err) => next(err));
  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.setHeader("Content-Type", "application/pdf");
  //   res.setHeader("Content-Disposition", 'inline; filename="' + invoice + '"');
  //   res.send(data);
  // });

  // const file = fs.createReadStream(invoicePath);
  // res.setHeader("Content-Type", "application/pdf");
  // res.setHeader("Content-Disposition", 'inline; filename="' + invoice + '"');
  // file.pipe(res);
};
