const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// GET all menu items
router.get("/", async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1, name: 1 });
  res.json(items);
});

// TEMPORARY SEED ROUTE — REMOVE AFTER SEEDING
router.post("/seed", async (req, res) => {
  try {
    await MenuItem.deleteMany({});

    const data = [
      { name: "Shumai Dumplings", description: "Steamed pork and shrimp dumplings", price: 8.99, category: "appetizer" },
      { name: "Steamed Pork Buns", description: "Soft buns filled with sweet and savory barbecued pork", price: 7.5, category: "appetizer" },
      { name: "Wonton Soup", description: "Delicate pork-filled wontons served in a warm, savory broth", price: 6.99, category: "appetizer" },
      { name: "Peking Duck", description: "Crispy roasted duck with thin pancakes, scallions, and hoisin sauce", price: 72.99, category: "entree" },
      { name: "Seafood Platter", description: "Fresh shrimp, sashimi, scallops, and uni on ice — perfect for sharing", price: 68.99, category: "entree" },
      { name: "Pan-Fried Beef Noodles", description: "Stir-fried noodles with tender beef and vegetables in soy glaze", price: 14.5, category: "entree" },
      { name: "Mapo Tofu", description: "Spicy Sichuan tofu with minced pork in chili and bean paste sauce", price: 12.99, category: "entree" },
      { name: "Mango Pudding", description: "Silky mango custard served chilled with a hint of cream", price: 4.99, category: "dessert" },
      { name: "Sesame Balls", description: "Crispy sesame-coated rice balls filled with sweet lotus seed paste", price: 5.25, category: "dessert" },
    ];

    const inserted = await MenuItem.insertMany(data);
    res.json({ inserted: inserted.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD routes
router.post("/", async (req, res) => {
  const created = await MenuItem.create(req.body);
  res.status(201).json(created);
});

router.put("/:id", async (req, res) => {
  const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
