const express = require("express");
const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// ✅ GET all carts (admin view)
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find()
      .sort({ updatedAt: -1 })
      .populate("items.menuItem", "name price category");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE a new cart
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({});
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single cart
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("items.menuItem", "name price category imageUrl description");
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD/UPDATE item in cart
router.patch("/:id/items", async (req, res) => {
  try {
    const { menuItemId, qtyDelta, qty } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ message: "menuItemId is required" });
    }

    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.status === "checked_out") {
      return res.status(400).json({ message: "Cannot modify checked out cart" });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const idx = cart.items.findIndex(i => String(i.menuItem) === String(menuItemId));

    if (idx === -1) {
      // Add new item
      const initialQty = qty ?? (qtyDelta ?? 1);
      if (initialQty <= 0) {
        return res.status(400).json({ message: "Quantity must be positive" });
      }

      cart.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        qty: initialQty
      });
    } else {
      // Update existing item
      if (typeof qty === "number") {
        if (qty <= 0) {
          cart.items.splice(idx, 1); // Remove if qty is 0 or negative
        } else {
          cart.items[idx].qty = qty;
        }
      } else {
        cart.items[idx].qty += (qtyDelta ?? 0);
        if (cart.items[idx].qty <= 0) {
          cart.items.splice(idx, 1);
        }
      }
    }

    await cart.save();
    
    // Return populated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.menuItem", "name price category imageUrl");
    
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ REMOVE item from cart
router.delete("/:id/items/:menuItemId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.status === "checked_out") {
      return res.status(400).json({ message: "Cannot modify checked out cart" });
    }

    cart.items = cart.items.filter(i => String(i.menuItem) !== req.params.menuItemId);
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.menuItem", "name price category");
    
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CLEAR cart (remove all items)
router.delete("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.status === "checked_out") {
      return res.status(400).json({ message: "Cannot modify checked out cart" });
    }

    cart.items = [];
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cart summary/statistics
router.get("/:id/summary", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("items.menuItem", "name price category");
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = Number((subtotal * 0.08875).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    const itemCount = cart.items.reduce((sum, i) => sum + i.qty, 0);

    res.json({
      cartId: cart._id,
      itemCount,
      subtotal,
      tax,
      total,
      items: cart.items,
      status: cart.status
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;