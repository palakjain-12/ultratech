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
    const session = await mongoose.startSession();
    session.startTransaction();
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

      const equipment = await Equipment.findOne({ equipmentId }).session(session);
      if (!equipment) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid Equipment ID" });
      }

      const sparesDocs = [];
      for (const item of sparesUsed) {
        const part = await SparePart.findOne({ partId: item.partId }).session(session);
        if (!part) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Invalid Part ID: ${item.partId}` });
        }
        if (part.currentStock < item.quantity) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Insufficient stock for ${part.name}` });
        }
        part.currentStock -= item.quantity;
        await part.save({ session });
        sparesDocs.push({ part: part._id, quantity: item.quantity });
      }

      const log = await MaintenanceLog.create(
        [
          {
            maintenanceId,
            equipment: equipment._id,
            maintenanceType,
            description,
            technicianName,
            dateOfService: new Date(dateOfService),
            sparesUsed: sparesDocs,
            downtimeDurationMinutes,
            remarks
          }
        ],
        { session }
      );

      equipment.lastMaintenanceDate = new Date(dateOfService);
      await equipment.save({ session });

      await session.commitTransaction();
      session.endSession();

      const populated = await MaintenanceLog.findById(log[0]._id)
        .populate("equipment")
        .populate("sparesUsed.part");
      res.status(201).json(populated);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
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
