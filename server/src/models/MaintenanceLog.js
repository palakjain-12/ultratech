// Mongoose model for maintenance logs; updates equipment and consumes spares
import mongoose from "mongoose";

const sparesUsedSchema = new mongoose.Schema(
  {
    part: { type: mongoose.Schema.Types.ObjectId, ref: "SparePart", required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const maintenanceLogSchema = new mongoose.Schema(
  {
    maintenanceId: { type: String, required: true, unique: true },
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
    maintenanceType: { type: String, enum: ["Preventive", "Breakdown"], required: true },
    description: { type: String, required: true },
    technicianName: { type: String, required: true },
    dateOfService: { type: Date, required: true },
    sparesUsed: [sparesUsedSchema],
    downtimeDurationMinutes: { type: Number, default: 0, min: 0 },
    remarks: { type: String },
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceLog", maintenanceLogSchema);
