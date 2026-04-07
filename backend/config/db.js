import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // ✔ FIX 1: Using MONGO_URI properly
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database Connected");
    } catch (err) {
        // ✔ FIX 2: Better error logging
        console.error("Database Connection Failed:", err.message);
        process.exit(1);
    }
};

export default connectDB;
