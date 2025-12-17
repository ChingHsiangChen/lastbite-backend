const express = require("express");
const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// Create a new cart
router.post("/", async (req, res) => {
  const cart = await Cart.create({});
  res.status(201).json(cart);
});

// Get cart
router.get("/:id", async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  res.json(cart);
});

// Add/update item qty in cart
// body: { menuItemId, qtyDelta } OR { menuItemId, qty }
router.patch("/:id/items", async (req, res) => {
  const { menuItemId, qtyDelta, qty } = req.body;

  const cart = await Cart.findById(req.params.id);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

  const idx = cart.items.findIndex(i => String(i.menuItem) === String(menuItemId));

  if (idx === -1) {
    const initialQty = qty ?? (qtyDelta ?? 1);
    if (initialQty <= 0) return res.status(400).json({ message: "Invalid qty" });

    cart.items.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      qty: initialQty
    });
  } else {
    if (typeof qty === "number") {
      cart.items[idx].qty = qty;
    } else {
      cart.items[idx].qty += (qtyDelta ?? 0);
    }

    if (cart.items[idx].qty <= 0) {
      cart.items.splice(idx, 1);
    }
  }

  await cart.save();
  res.json(cart);
});

// Remove item completely
router.delete("/:id/items/:menuItemId", async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => String(i.menuItem) !== req.params.menuItemId);
  await cart.save();
  res.json(cart);
});

// Clear cart
router.delete("/:id", async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  cart.items = [];
  await cart.save();
  res.json(cart);
});

module.exports = router;

