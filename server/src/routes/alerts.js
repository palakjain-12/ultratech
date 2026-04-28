// Alerts route calculating low stock and maintenance due
import express from "express";
import Equipment from "../models/Equipment.js";
import SparePart from "../models/SparePart.js";
import MaintenanceLog from "../models/MaintenanceLog.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (_req, res) => {
  try {
    const [equipments, parts, maintenanceCount] = await Promise.all([
      Equipment.find(),
      SparePart.find(),
      MaintenanceLog.countDocuments()
    ]);
    const today = new Date();
    const maintenanceDue = equipments.filter((eq) => {
      // If no maintenance has ever been done, use installation date as the starting point
      const baseDate = eq.lastMaintenanceDate || eq.installationDate;
      if (!baseDate) return true; // Safety check

      const nextDue = new Date(baseDate);
      nextDue.setDate(nextDue.getDate() + eq.serviceIntervalDays);
      return nextDue < today;
    });
    const lowStock = parts.filter((p) => p.currentStock < p.reorderLevel);
    res.json({
      maintenanceDue,
      lowStock,
      summary: {
        totalEquipment: equipments.length,
        totalMaintenanceLogs: maintenanceCount,
        lowStockCount: lowStock.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
