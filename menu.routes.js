const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

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
