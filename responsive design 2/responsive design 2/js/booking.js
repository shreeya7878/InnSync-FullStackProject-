document.getElementById("booking-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const bookingData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: { // This is the corrected structure for address
          street1: document.getElementById("street1").value,
          street2: document.getElementById("street2").value,
          city: document.getElementById("city").value,
          state: document.getElementById("state").value,
          zipCode: document.getElementById("zipCode").value,
      },
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      arrivalDate: document.getElementById("arrivalDate").value,
      arrivalTime: document.getElementById("arrivalTime").value,
      departureDate: document.getElementById("departureDate").value,
      departureTime: document.getElementById("departureTime").value,
      numAdults: document.getElementById("numAdults").value,
      numKids: document.getElementById("numKids").value,
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value,
      specialRequest: document.getElementById("specialRequest").value,
  };

  // Debug: Log the form data
  console.log("Form Data Collected:", bookingData);

  // Check if the payment method is selected
  if (!bookingData.paymentMethod) {
    swal("Error", "Please select a payment method.", "error");
    return; // Stop form submission if payment method is not selected
  }

  // Submit the booking data to the backend
  fetch("http://localhost:3000/bookings", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
})
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to submit booking");
        }
    })
    .then((data) => {
        console.log("Booking successfully submitted:", data);
        swal("Booking Successful!", "Your booking has been confirmed.", "success");

        // Optionally reset the form
        document.getElementById("booking-form").reset();

        // Refresh the page after a successful booking submission
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    })
    .catch((error) => {
        console.error("Error submitting booking:", error);
        swal("Error", "Failed to submit booking. Please try again.", "error");
    });
});
