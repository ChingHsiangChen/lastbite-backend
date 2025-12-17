const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ["appetizer", "entree", "dessert"] },
    imageUrl: { type: String, default: "" } // optional: "/Food/duck.jpeg"
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
