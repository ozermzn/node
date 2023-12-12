const mongoose = require("mongoose");
const Product = require("./product");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Products",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.productID.toString() === product._id.toString()
  );
  let newQuantity = 1;

  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productID: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.deleteCartItemByID = function (itemID) {
  const updatedCartItems = this.cart.items.filter(
    (product) => product.productID.toString() !== itemID.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
// const getDB = require("../util/database").getDB;
// const mongodb = require("mongodb");
// const { deleteCartItem } = require("../controllers/shop");
// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//   save() {
//     const db = getDB();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         console.log("Created user!");
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(
//       (cp) => cp.productID.toString() === product._id.toString()
//     );
//     let newQuantity = 1;

//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productID: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDB();

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//   getCart() {
//     const db = getDB();
//     const productIDs = this.cart.items.map((p) => p.productID);
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIDs } })
//       .toArray()
//       .then((p) => {
//         return p.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (i) => i.productID.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       });
//   }
//   deleteCartItemByID(itemID) {
//     const updatedCartItems = this.cart.items.filter(
//       (product) => product.productID.toString() !== itemID.toString()
//     );
//     const db = getDB();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }
//   addOrder() {
//     const db = getDB();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDB();
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   static findByID(userID) {
//     const db = getDB();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userID) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
