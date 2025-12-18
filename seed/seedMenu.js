// seedMenu.js
// Run this once to populate MongoDB with menu items.
// Usage:
//   Mac/Linux:  MONGODB_URI="your_uri" node seedMenu.js
//   Windows PS: $env:MONGODB_URI="your_uri"; node seedMenu.js

require("dotenv").config();
const mongoose = require("mongoose");

// ✅ IMPORTANT: adjust this path if your MenuItem model lives somewhere else
// If seedMenu.js is at backend root and models are in ./models:
const MenuItem = require("./models/MenuItem");

const data = [
  {
    name: "Shumai Dumplings",
    price: 8.99,
    category: "appetizer",
    description: "Steamed open-topped dumplings filled with seasoned pork and shrimp.",
    imageUrl: "/Food/shumai.jpeg",
  },
  {
    name: "Steamed Pork Buns",
    price: 7.5,
    category: "appetizer",
    description: "Soft buns filled with sweet and savory barbecued pork.",
    imageUrl: "/Food/porkbun.jpeg",
  },
  {
    name: "Wonton Soup",
    price: 6.99,
    category: "appetizer",
    description: "Delicate pork-filled wontons served in a warm, savory broth.",
  },

  {
    name: "Peking Duck",
    price: 72.99,
    category: "entree",
    description: "Crispy roasted duck with thin pancakes, scallions, and hoisin sauce.",
    imageUrl: "/Food/duck.jpeg",
  },
  {
    name: "Seafood Platter",
    price: 68.99,
    category: "entree",
    description: "Fresh shrimp, sashimi, scallops, and uni on ice — perfect for sharing.",
    imageUrl: "/Food/seafood.jpeg",
  },
  {
    name: "Pan-Fried Beef Noodles",
    price: 14.5,
    category: "entree",
    description: "Stir-fried noodles with tender beef and vegetables in soy glaze.",
    imageUrl: "/Food/Noodles.jpeg",
  },
  {
    name: "Mapo Tofu",
    price: 12.99,
    category: "entree",
    description: "Spicy Sichuan tofu with minced pork in chili and bean paste sauce.",
    imageUrl: "/Food/Mapo Tofu.jpeg",
  },

  {
    name: "Mango Pudding",
    price: 4.99,
    category: "dessert",
    description: "Silky mango custard served chilled with a hint of cream.",
  },
  {
    name: "Sesame Balls",
    price: 5.25,
    category: "dessert",
    description: "Crispy sesame-coated rice balls filled with sweet lotus seed paste.",
  },
];

(async () => {
  try {
    // ✅ Use the same env var your backend uses on Render
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error("Missing MONGODB_URI (or MONGO_URI) in env.");

    await mongoose.connect(uri);

    // Optional: wipe and re-seed
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(data);

    console.log(`Seeded menu! Inserted ${data.length} items.`);
  } catch (err) {
    console.error("SEED FAILED:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
