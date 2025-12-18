const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// ✅ GET all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET menu items by category
router.get("/category/:category", async (req, res) => {
  try {
    const items = await MenuItem.find({ 
      category: req.params.category 
    }).sort({ name: 1 });
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET single menu item
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE menu item
router.post("/", async (req, res) => {
  try {
    const created = await MenuItem.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ UPDATE menu item
router.put("/:id", async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE menu item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ SEED endpoint (temporary - remove in production)
router.post("/seed", async (req, res) => {
  try {
    await MenuItem.deleteMany({});

    const data = [
      { name: "Shumai Dumplings", price: 8.99, category: "appetizer", description: "Steamed pork and shrimp dumplings", imageUrl: "/Food/shumai.jpeg" },
      { name: "Steamed Pork Buns", price: 7.5, category: "appetizer", description: "Soft buns filled with sweet and savory barbecued pork", imageUrl: "/Food/porkbun.jpeg" },
      { name: "Wonton Soup", price: 6.99, category: "appetizer", description: "Delicate pork-filled wontons served in a warm, savory broth" },
      { name: "Peking Duck", price: 72.99, category: "entree", description: "Crispy roasted duck with thin pancakes, scallions, and hoisin sauce", imageUrl: "/Food/duck.jpeg" },
      { name: "Seafood Platter", price: 68.99, category: "entree", description: "Fresh shrimp, sashimi, scallops, and uni on ice — perfect for sharing", imageUrl: "/Food/seafood.jpeg" },
      { name: "Pan-Fried Beef Noodles", price: 14.5, category: "entree", description: "Stir-fried noodles with tender beef and vegetables in soy glaze", imageUrl: "/Food/Noodles.jpeg" },
      { name: "Mapo Tofu", price: 12.99, category: "entree", description: "Spicy Sichuan tofu with minced pork in chili and bean paste sauce", imageUrl: "/Food/Mapo Tofu.jpeg" },
      { name: "Mango Pudding", price: 4.99, category: "dessert", description: "Silky mango custard served chilled with a hint of cream" },
      { name: "Sesame Balls", price: 5.25, category: "dessert", description: "Crispy sesame-coated rice balls filled with sweet lotus seed paste" },
    ];

    const inserted = await MenuItem.insertMany(data);
    res.json({ 
      success: true, 
      inserted: inserted.length,
      message: `Seeded ${inserted.length} menu items` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Menu statistics
router.get("/stats/categories", async (req, res) => {
  try {
    const stats = await MenuItem.aggregate([
      { $group: { 
        _id: "$category", 
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;