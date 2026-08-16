import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "./Modules/User/UserMd.js"; 

dotenv.config({ path: "./config.env" });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATA_BASE);
    console.log("✅ Connected to Database.");

    const adminPhone = "+989123456789"; 
    const plainPassword = "adminPassword123";

    const existingAdmin = await User.findOne({ phoneNumber: adminPhone });
    if (existingAdmin) {
      console.log("⚠️ Admin account already exists in the database.");
      process.exit(0);
    }

    const hashedPassword = await bcryptjs.hash(plainPassword, 12);

    await User.create({
      fullName: "System Admin",
      phoneNumber: adminPhone,
      password: hashedPassword,
      role: "superAdmin",
    });

    console.log("🎉 Admin account created successfully!");
    console.log("-----------------------------------");
    console.log(`📱 Phone Number: 09123456789`);
    console.log(`🔑 Password: ${plainPassword}`);
    console.log("-----------------------------------");

  } catch (error) {
    console.error("❌ Error creating admin account:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();