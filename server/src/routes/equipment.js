// Equipment CRUD routes with Supervisor permissions
import express from "express";
import Equipment from "../models/Equipment.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (_req, res) => {
  try {
    const equipments = await Equipment.find().sort({ name: 1 });
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, authorizeRoles("Supervisor"), async (req, res) => {
  try {
    const eq = await Equipment.create(req.body);
    res.status(201).json(eq);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

router.put("/:id", authenticate, authorizeRoles("Supervisor"), async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Equipment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

export default router;
