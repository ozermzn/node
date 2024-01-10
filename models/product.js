const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Products", ProductSchema);

// const getDB = require("../util/database").getDB;
// const mongodb = require("mongodb");

// class Product {
//   constructor(title, price, description, imageUrl, id, userID) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userID = userID;
//   }
//   async save() {
//     const db = getDB();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return await dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         throw new Error(err);
//       });
//   }
//   static fetchAll() {
//     const db = getDB();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }
//   static findById(productID) {
//     const db = getDB();
//     return db
//       .collection("products")
//       .findOne({ _id: new mongodb.ObjectId(productID) })
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }
//   static deleteByID(productID) {
//     const db = getDB();
//     return db.collection("products").deleteOne({
//       _id: new mongodb.ObjectId(productID),
//     });
//   }
// }

// module.exports = Product;
