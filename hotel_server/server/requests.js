const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/hotel_data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define Mongoose schema and model
const bookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    zipCode: Number,
  },
  phone: String,
  email: String,
  arrivalDate: String,
  arrivalTime: String,
  departureDate: String,
  departureTime: String,
  numAdults: Number,
  numKids: Number,
  paymentMethod: String,
  specialRequest: String,
});

const Booking = mongoose.model("requests", bookingSchema);

// API Endpoint to handle form submission
app.post("/requests", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).send({ message: "Booking saved successfully", booking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).send({ message: "Error saving booking" });
  }
});

// Endpoint to fetch all pending requests
app.get("/requests", async (req, res) => {
  try {
    const requests = await Booking.find();
    res.status(200).send(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).send({ message: "Error fetching requests" });
  }
});

// Define a new schema and model for approved bookings
const approvedBookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    zipCode: Number,
  },
  phone: String,
  email: String,
  arrivalDate: String,
  arrivalTime: String,
  departureDate: String,
  departureTime: String,
  numAdults: Number,
  numKids: Number,
  paymentMethod: String,
  specialRequest: String,
});
const ApprovedBooking = mongoose.model("bookings", approvedBookingSchema);

// Endpoint to approve a booking request
app.post("/approve/:id", async (req, res) => {
  try {
    const bookingRequest = await Booking.findById(req.params.id);
    if (!bookingRequest) {
      return res.status(404).send({ message: "Request not found" });
    }

    // Move the request to "bookings" collection
    const approvedBooking = new ApprovedBooking(bookingRequest.toObject());
    await approvedBooking.save();

    // Delete the request from the "requests" collection
    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: "Booking approved and moved to bookings" });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).send({ message: "Error approving booking" });
  }
});

// Endpoint to delete a booking request
app.delete("/requests/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).send({ message: "Error deleting request" });
  }
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
