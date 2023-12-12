const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: [
    {
      userID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      username: { type: String, required: true },
    },
  ],
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
