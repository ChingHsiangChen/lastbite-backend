const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// GET all menu items (already exists)
router.get("/", async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

/* 🔴 TEMP SEED ROUTE — REMOVE AFTER SEEDING */
router.post("/seed", async (req, res) => {
  await MenuItem.deleteMany({});

  const data = [
    {
      name: "Shumai Dumplings",
      description: "Steamed pork and shrimp dumplings",
      price: 8.99,
      category: "appetizer",
    },
    {
      name: "Peking Duck",
      description: "Crispy roasted duck with pancakes",
      price: 72.99,
      category: "entree",
    },
    {
      name: "Mango Pudding",
      description: "Chilled mango custard",
      price: 4.99,
      category: "dessert",
    },
  ];

  const inserted = await MenuItem.insertMany(data);
  res.json({ inserted: inserted.length });
});

module.exports = router;

router.get("/", async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1, name: 1 });
  res.json(items);
});

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
