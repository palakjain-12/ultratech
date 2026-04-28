// Maintenance logging routes; auto-updates equipment and decrements spare stock
import express from "express";
import MaintenanceLog from "../models/MaintenanceLog.js";
import Equipment from "../models/Equipment.js";
import SparePart from "../models/SparePart.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === "Technician") {
      query.technicianName = req.user.name;
    }
    const logs = await MaintenanceLog.find(query)
      .populate("equipment")
      .populate("sparesUsed.part")
      .sort({ dateOfService: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  authenticate,
  authorizeRoles("Technician", "Supervisor"),
  async (req, res) => {
    try {
      const {
        maintenanceId,
        equipmentId,
        maintenanceType,
        description,
        technicianName,
        dateOfService,
        sparesUsed = [],
        downtimeDurationMinutes = 0,
        remarks
      } = req.body;

      // Check for unique maintenanceId
      const existingLog = await MaintenanceLog.findOne({ maintenanceId });
      if (existingLog) return res.status(400).json({ message: `Maintenance ID ${maintenanceId} already exists.` });

      // Validate equipment
      const equipment = await Equipment.findOne({ equipmentId });
      if (!equipment) return res.status(400).json({ message: `Invalid Equipment ID: ${equipmentId}` });

      // Process spares and validate stock
      const sparesDocs = [];
      for (const item of sparesUsed) {
        const part = await SparePart.findOne({ partId: item.partId });
        if (!part) return res.status(400).json({ message: `Invalid Spare Part ID: ${item.partId}` });
        if (part.currentStock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${part.name}. Available: ${part.currentStock}, Requested: ${item.quantity}` });
        }
        sparesDocs.push({ part: part._id, quantity: item.quantity });
      }

      // Create log and update equipment/spares sequentially
      const log = new MaintenanceLog({
        maintenanceId,
        equipment: equipment._id,
        maintenanceType,
        description,
        technicianName,
        dateOfService: new Date(dateOfService),
        sparesUsed: sparesDocs,
        downtimeDurationMinutes,
        remarks
      });
      await log.save();

      // Update equipment status and date
      equipment.lastMaintenanceDate = new Date(dateOfService);
      equipment.status = "Operational";
      await equipment.save();

      // Decrement spares stock
      for (const item of sparesUsed) {
        await SparePart.findOneAndUpdate(
          { partId: item.partId },
          { $inc: { currentStock: -item.quantity } }
        );
      }

      res.status(201).json(log);
    } catch (err) {
      console.error("Maintenance submit error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

router.put(
  "/:id/approve",
  authenticate,
  authorizeRoles("Supervisor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await MaintenanceLog.findByIdAndUpdate(
        id,
        { approved: true },
        { new: true }
      )
        .populate("equipment")
        .populate("sparesUsed.part");
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid data", error: err.message });
    }
  }
);

export default router;
