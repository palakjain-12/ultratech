// Spare parts inventory routes with Store Manager permissions
import express from "express";
import SparePart from "../models/SparePart.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (_req, res) => {
  try {
    const parts = await SparePart.find().sort({ name: 1 });
    res.json(parts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  authenticate,
  authorizeRoles("Store Manager", "Supervisor"),
  async (req, res) => {
    try {
      const part = await SparePart.create(req.body);
      res.status(201).json(part);
    } catch (err) {
      res.status(400).json({ message: "Invalid data", error: err.message });
    }
  }
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("Store Manager", "Supervisor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await SparePart.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid data", error: err.message });
    }
  }
);

export default router;
