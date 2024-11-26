import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = "mongodb://127.0.0.1:27017/hotel_data";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

/**
 * Schema and Models
 */

// Booking Requests Schema and Model
const bookingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: {
    street1: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: Number, required: true },
  },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  arrivalTime: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  numAdults: { type: Number, required: true },
  numKids: { type: Number },
  paymentMethod: { type: String, required: true },
  specialRequest: { type: String },
});

const BookingRequest = mongoose.model("requests", bookingSchema); // Pending requests
const ApprovedBooking = mongoose.model("bookings", bookingSchema); // Confirmed bookings

// Inventory Schema and Model
const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  whereNeeded: { type: String, required: true },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

/**
 * API Routes
 */

// Bookings Routes

// Save a booking request
app.post("/requests", async (req, res) => {
  try {
    const booking = new BookingRequest(req.body);
    await booking.save();
    res.status(201).send({ message: "Booking request saved successfully", booking });
  } catch (error) {
    console.error("Error saving booking request:", error);
    res.status(500).send({ message: "Error saving booking request" });
  }
});

// Save a booking directly to the bookings collection
app.post("/bookings", async (req, res) => {
  try {
    const booking = new ApprovedBooking(req.body);
    await booking.save();
    res.status(201).send({ message: "Booking saved directly to bookings", booking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).send({ message: "Error saving booking" });
  }
});

// Fetch all pending requests
app.get("/requests", async (req, res) => {
  try {
    const requests = await BookingRequest.find();
    res.status(200).send(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).send({ message: "Error fetching requests" });
  }
});

// Approve a booking request
app.post("/approve/:id", async (req, res) => {
  try {
    const bookingRequest = await BookingRequest.findById(req.params.id);
    if (!bookingRequest) {
      return res.status(404).send({ message: "Request not found" });
    }

    const approvedBooking = new ApprovedBooking(bookingRequest.toObject());
    await approvedBooking.save();
    await BookingRequest.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: "Booking approved and moved to bookings" });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).send({ message: "Error approving booking" });
  }
});

// Delete a booking request
app.delete("/requests/:id", async (req, res) => {
  try {
    await BookingRequest.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).send({ message: "Error deleting request" });
  }
});

// Search for bookings (by firstName or lastName)
app.get("/bookings/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const bookings = await ApprovedBooking.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error searching bookings:", error);
    res.status(500).json({ error: "Failed to search bookings" });
  }
});

// Inventory Routes

// Save inventory data
app.post("/inventory", async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(200).json({ message: "Inventory item saved successfully" });
  } catch (error) {
    console.error("Error saving inventory item:", error);
    res.status(500).json({ error: "Failed to save inventory item" });
  }
});

// Fetch all inventory items
app.get("/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory data" });
  }
});
// Delete a booking by ID
app.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await ApprovedBooking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking successfully deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking" });
  }
});


/**
 * Start the Server
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
