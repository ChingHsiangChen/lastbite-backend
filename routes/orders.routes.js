const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const router = express.Router();

const TAX_RATE = 0.08875;

router.post("/", async (req, res) => {
  const { cartId, customer } = req.body;

  const cart = await Cart.findById(cartId);
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  if (cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const order = await Order.create({
    cartId: cart._id,
    items: cart.items.map(i => ({
      menuItem: i.menuItem,
      name: i.name,
      price: i.price,
      qty: i.qty
    })),
    subtotal,
    tax,
    total,
    customer: customer || {}
  });

  cart.status = "checked_out";
  await cart.save();

  res.status(201).json(order);
});

// optional: list orders
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;

