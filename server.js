require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const menuRoutes = require("./routes/menu.routes");
const cartRoutes = require("./routes/carts.routes");
const orderRoutes = require("./routes/orders.routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/menu", menuRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connected");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`API running on http://localhost:${process.env.PORT || 5000}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
