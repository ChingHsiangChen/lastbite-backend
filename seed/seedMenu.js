// seedMenu.js (BACKEND)
// Run locally against the SAME MONGODB_URI your Render backend uses.

require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

// ✅ absolute import so it works regardless of where you run it from
const MenuItem = require(path.join(__dirname, "..", "models", "MenuItem"));

const data = [
  {
    name: "Shumai Dumplings",
    price: 8.99,
    category: "appetizer",
    description:
      "Steamed open-topped dumplings filled with seasoned pork and shrimp.",
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
    description:
      "Crispy roasted duck with thin pancakes, scallions, and hoisin sauce.",
    imageUrl: "/Food/duck.jpeg",
  },
  {
    name: "Seafood Platter",
    price: 68.99,
    category: "entree",
    description:
      "Fresh shrimp, sashimi, scallops, and uni on ice — perfect for sharing.",
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
    description:
      "Crispy sesame-coated rice balls filled with sweet lotus seed paste.",
  },
];

(async () => {
  try {
    // ✅ IMPORTANT: seed the SAME URI that Render uses for the backend
    const uri = "mongodb+srv://chinghsiangchen:ching741852963@lastbite.70av91z.mongodb.net/lastbite?retryWrites=true&w=majority&appName=lastbite"; // use this only, to avoid seeding the wrong DB
    if (!uri) throw new Error("Missing MONGODB_URI in environment variables.");

    await mongoose.connect(uri);

    // Print where you're connected (this reveals when you're seeding the wrong DB)
    console.log("Connected to:", {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
    });

    const before = await MenuItem.countDocuments();
    console.log("MenuItem count BEFORE:", before);

    await MenuItem.deleteMany({});
    const inserted = await MenuItem.insertMany(data, { ordered: true });

    const after = await MenuItem.countDocuments();
    console.log("Inserted:", inserted.length);
    console.log("MenuItem count AFTER:", after);

    if (after === 0) {
      throw new Error("Seeding ran but MenuItem count is still 0. Wrong DB/URI.");
    }

    console.log("✅ Seeding complete.");
  } catch (err) {
    console.error("❌ SEED FAILED:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
