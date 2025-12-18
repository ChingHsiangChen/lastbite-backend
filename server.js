require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const menuRoutes = require("./routes/menu.routes");
const cartRoutes = require("./routes/carts.routes");
const orderRoutes = require("./routes/orders.routes");

const app = express();

app.use(express.json());

// ✅ CORS: allow local dev + deployed frontend(s)
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ["https://lastbite.wuaze.com"]
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (Postman, curl)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Debug endpoint
app.get("/api/debug", async (req, res) => {
  try {
    const MenuItem = require("./models/MenuItem");
    const count = await MenuItem.countDocuments();
    const dbName = mongoose.connection.db ? mongoose.connection.db.databaseName : "Not connected";
    res.json({
      dbConnected: mongoose.connection.readyState === 1,
      dbName: dbName,
      menuItemsCount: count,
      environment: process.env.NODE_ENV,
      mongoURISet: !!process.env.MONGODB_URI
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ CORRECT ROUTING - Support both singular and plural
app.use("/api/menu", menuRoutes);

// Cart routes - support both /cart and /carts
app.use("/api/cart", cartRoutes);
app.use("/api/carts", cartRoutes);

// Order routes - support both /order and /orders
app.use("/api/order", orderRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 10000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo connected");

    // ✅ bind to 0.0.0.0 for Render
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();