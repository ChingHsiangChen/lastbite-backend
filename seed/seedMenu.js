require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

const data = [
  { name: "Shumai Dumplings", price: 8.99, category: "appetizer", description: "Steamed open-topped dumplings filled with seasoned pork and shrimp.", imageUrl: "/Food/shumai.jpeg" },
  { name: "Steamed Pork Buns", price: 7.5, category: "appetizer", description: "Soft buns filled with sweet and savory barbecued pork.", imageUrl: "/Food/porkbun.jpeg" },
  { name: "Wonton Soup", price: 6.99, category: "appetizer", description: "Delicate pork-filled wontons served in a warm, savory broth." },

  { name: "Peking Duck", price: 72.99, category: "entree", description: "Crispy roasted duck with thin pancakes, scallions, and hoisin sauce.", imageUrl: "/Food/duck.jpeg" },
  { name: "Seafood Platter", price: 68.99, category: "entree", description: "Fresh shrimp, sashimi, scallops, and uni on ice — perfect for sharing.", imageUrl: "/Food/seafood.jpeg" },
  { name: "Pan-Fried Beef Noodles", price: 14.5, category: "entree", description: "Stir-fried noodles with tender beef and vegetables in soy glaze.", imageUrl: "/Food/Noodles.jpeg" },
  { name: "Mapo Tofu", price: 12.99, category: "entree", description: "Spicy Sichuan tofu with minced pork in chili and bean paste sauce.", imageUrl: "/Food/Mapo Tofu.jpeg" },
  { name: "Beef Fried Rice", price: 9.5, category: "entree", description: "Fragrant rice stir-fried with marinated beef and scallions." },
  { name: "Sesame Chicken", price: 10.25, category: "entree", description: "Crispy chicken glazed in a tangy sesame sauce with toasted seeds." },

  { name: "Sweet Red Bean Buns", price: 5.5, category: "dessert", description: "Soft steamed buns filled with sweet red bean paste." },
  { name: "Mango Pudding", price: 4.99, category: "dessert", description: "Silky mango custard served chilled with a hint of cream." },
  { name: "Sesame Balls", price: 5.25, category: "dessert", description: "Crispy sesame-coated rice balls filled with sweet lotus seed paste." }
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(data);
  console.log("Seeded menu!");
  await mongoose.disconnect();
})();
