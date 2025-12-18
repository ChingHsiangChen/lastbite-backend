// Add this to menu.routes.js (temporary, remove after seeding)
router.post("/seed", async (req, res) => {
  await MenuItem.deleteMany({});

  const data = [
    { name: "Shumai Dumplings", description: "Steamed pork and shrimp dumplings", price: 8.99, category: "appetizer" },
    { name: "Peking Duck", description: "Crispy roasted duck with pancakes", price: 72.99, category: "entree" },
    { name: "Mango Pudding", description: "Chilled mango custard", price: 4.99, category: "dessert" },
  ];

  const inserted = await MenuItem.insertMany(data);
  res.json({ inserted: inserted.length });
});
