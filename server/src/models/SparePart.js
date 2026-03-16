// Mongoose model for spare parts inventory with reorder threshold
import mongoose from "mongoose";

const sparePartSchema = new mongoose.Schema(
  {
    partId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    equipmentCategory: {
      type: String,
      enum: ["Crusher", "Conveyor", "Packing Machine", "Kiln", "General"],
      required: true
    },
    currentStock: { type: Number, required: true, min: 0 },
    reorderLevel: { type: Number, required: true, min: 0 },
    supplierName: { type: String, required: true },
    unitCost: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("SparePart", sparePartSchema);
