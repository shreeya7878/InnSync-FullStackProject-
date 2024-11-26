import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = "mongodb://127.0.0.1:27017/hotel_data";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Booking schema and model
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

const Booking = mongoose.model("Booking", bookingSchema);

// Endpoint to save booking data
app.post("/bookings", async (req, res) => {
  try {
      console.log("Received booking data:", req.body); // Log the incoming data
      
      const newBooking = new Booking(req.body);
      console.log("Created new booking instance:", newBooking); // Log the new instance before saving
      
      await newBooking.save(); // Attempt to save the booking
      
      console.log("Booking saved to database successfully"); // Log successful save
      res.status(200).json({ message: "Booking saved successfully" });
  } catch (error) {
      console.error("Error saving booking:", error); // Log any errors
      res.status(500).json({ error: "Failed to save booking" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Add the following route to search by name (firstName or lastName)
app.get("/bookings/search", async (req, res) => {
  try {
    const { query } = req.query; // This will be the search term from the query string
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Search for bookings that match the query in either firstName or lastName
    const bookings = await Booking.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } }, // Case-insensitive search for first name
        { lastName: { $regex: query, $options: "i" } },  // Case-insensitive search for last name
      ],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error searching bookings:", error);
    res.status(500).json({ error: "Failed to search bookings" });
  }
});
