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
const allowedOrigins = [
  "http://localhost:5173",

  process.env.CLIENT_ORIGIN, // set this on Render to your frontend URL (Netlify/Vercel/Render Static)
].filter(Boolean);

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

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/menu", menuRoutes);
app.use("/api/carts", cartRoutes);
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
