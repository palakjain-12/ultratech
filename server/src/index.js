// Entry point for Express API server; wires routes and DB connection
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import equipmentRoutes from "./routes/equipment.js";
import maintenanceRoutes from "./routes/maintenance.js";
import sparesRoutes from "./routes/spares.js";
import alertsRoutes from "./routes/alerts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/maintenance", maintenanceRoutes);
app.use("/spares", sparesRoutes);
app.use("/alerts", alertsRoutes);

const PORT = process.env.PORT || 5000;

// Bootstraps database and starts HTTP server
const start = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("Missing MONGODB_URI in environment");
    process.exit(1);
  }
  await connectDB(mongoUri);
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
