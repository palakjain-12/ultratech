// Mongoose model for plant equipment with service interval tracking
import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    equipmentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Crusher", "Conveyor", "Packing Machine", "Kiln"],
      required: true
    },
    plantSection: { type: String, required: true },
    installationDate: { type: Date, required: true },
    lastMaintenanceDate: { type: Date },
    serviceIntervalDays: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["Operational", "Under Maintenance"],
      default: "Operational"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
