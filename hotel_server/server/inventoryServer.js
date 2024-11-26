import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON data

// Connect to MongoDB
const MONGO_URI = "mongodb://127.0.0.1:27017/hotel_data";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define the Inventory Schema
const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  whereNeeded: { type: String, required: true },
});

// Define the Inventory Model
const Inventory = mongoose.model("Inventory", inventorySchema);

// Endpoint to save inventory data
app.post("/inventory", async (req, res) => {
  try {
    console.log("Received inventory data:", req.body); // Log incoming data for debugging

    const newItem = new Inventory(req.body);
    console.log("Created new inventory item:", newItem); // Log the new instance

    await newItem.save(); // Save to MongoDB

    console.log("Inventory item saved to database successfully");
    res.status(200).json({ message: "Inventory item saved successfully" });
  } catch (error) {
    console.error("Error saving inventory item:", error);
    res.status(500).json({ error: "Failed to save inventory item" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint to fetch all inventory data
app.get("/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.find(); // Retrieve all items from the database
    res.status(200).json(inventory); // Send the data as JSON
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory data" });
  }
});
