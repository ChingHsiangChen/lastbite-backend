const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const router = express.Router();

const TAX_RATE = 0.08875;

// ✅ GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("cartId", "status")
      .populate("items.menuItem", "name category");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("cartId", "status")
      .populate("items.menuItem", "name category imageUrl");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE new order
router.post("/", async (req, res) => {
  try {
    const { cartId, customer } = req.body;

    // Validate input
    if (!cartId) {
      return res.status(400).json({ message: "cartId is required" });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    if (cart.status === "checked_out") {
      return res.status(400).json({ message: "Cart already checked out" });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    // Create order
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
      customer: customer || {},
      status: "pending"
    });

    // Update cart status
    cart.status = "checked_out";
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE order status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status", 
        validStatuses 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE order (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Order statistics (optional)
router.get("/stats/summary", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("total status createdAt");

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;