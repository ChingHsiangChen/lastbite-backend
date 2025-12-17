const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },   // snapshot for convenience
    price: { type: Number, required: true },  // snapshot for convenience
    qty: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    items: { type: [CartItemSchema], default: [] },
    status: { type: String, enum: ["active", "checked_out"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
