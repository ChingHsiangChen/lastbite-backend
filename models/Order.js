const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name: String,
    price: Number,
    qty: Number
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    items: { type: [OrderItemSchema], required: true },
    subtotal: Number,
    tax: Number,
    total: Number,
    customer: {
      name: { type: String, default: "" },
      email: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
