import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Equipment from "../models/Equipment.js";
import SparePart from "../models/SparePart.js";
import MaintenanceLog from "../models/MaintenanceLog.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    await Promise.all([
      User.deleteMany({}),
      Equipment.deleteMany({}),
      SparePart.deleteMany({}),
      MaintenanceLog.deleteMany({})
    ]);

    const password = "password123";
    const hash = await bcrypt.hash(password, 10);
    const users = await User.insertMany([
      { name: "A. Sharma", email: "supervisor@ultratech.com", passwordHash: hash, role: "Supervisor" },
      { name: "R. Kumar", email: "technician@ultratech.com", passwordHash: hash, role: "Technician" },
      { name: "P. Singh", email: "store@ultratech.com", passwordHash: hash, role: "Store Manager" }
    ]);

    const equipments = await Equipment.insertMany([
      {
        equipmentId: "EQ-CR-001",
        name: "Primary Crusher",
        type: "Crusher",
        plantSection: "Raw Mill",
        installationDate: new Date("2018-04-15"),
        lastMaintenanceDate: new Date("2026-01-10"),
        serviceIntervalDays: 60,
        status: "Operational"
      },
      {
        equipmentId: "EQ-CV-002",
        name: "Clinker Conveyor",
        type: "Conveyor",
        plantSection: "Kiln",
        installationDate: new Date("2019-09-01"),
        lastMaintenanceDate: new Date("2025-12-20"),
        serviceIntervalDays: 45,
        status: "Operational"
      },
      {
        equipmentId: "EQ-PM-003",
        name: "Packing Machine 3",
        type: "Packing Machine",
        plantSection: "Packing Plant",
        installationDate: new Date("2021-06-05"),
        lastMaintenanceDate: new Date("2026-02-05"),
        serviceIntervalDays: 30,
        status: "Under Maintenance"
      }
    ]);

    const spares = await SparePart.insertMany([
      {
        partId: "SP-CR-BEAR-01",
        name: "Crusher Bearing Set",
        equipmentCategory: "Crusher",
        currentStock: 8,
        reorderLevel: 5,
        supplierName: "ABC Industrial",
        unitCost: 3500
      },
      {
        partId: "SP-CV-BELT-02",
        name: "Conveyor Belt",
        equipmentCategory: "Conveyor",
        currentStock: 3,
        reorderLevel: 4,
        supplierName: "ConveyPro",
        unitCost: 12000
      },
      {
        partId: "SP-PM-NOZZ-03",
        name: "Packing Nozzle",
        equipmentCategory: "Packing Machine",
        currentStock: 25,
        reorderLevel: 10,
        supplierName: "PackTech",
        unitCost: 900
      },
      {
        partId: "SP-GN-GREASE",
        name: "Industrial Grease",
        equipmentCategory: "General",
        currentStock: 50,
        reorderLevel: 20,
        supplierName: "LubriMax",
        unitCost: 150
      }
    ]);

    console.log("Seed completed:");
    console.log(`Users: ${users.length}, Equipments: ${equipments.length}, SpareParts: ${spares.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();

