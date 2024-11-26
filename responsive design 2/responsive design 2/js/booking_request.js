document.getElementById("user-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
  
    // Collect form data
    const requestData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: {
        street1: document.getElementById("street1").value,
        street2: document.getElementById("street2").value || "",
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zipCode: parseInt(document.getElementById("zipCode").value),
      },
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      arrivalDate: document.getElementById("arrivalDate").value,
      arrivalTime: document.getElementById("arrivalTime").value,
      departureDate: document.getElementById("departureDate").value,
      departureTime: document.getElementById("departureTime").value,
      numAdults: parseInt(document.getElementById("numAdults").value),
      numKids: parseInt(document.getElementById("numKids").value) || 0,
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
      specialRequest: document.getElementById("specialRequest").value || "",
    };
  
    // Debug: Log collected data
    console.log("Submitting request:", requestData);
  
    // Submit data to backend
    fetch("http://localhost:3000/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to save booking");
        }
      })
      .then((data) => {
        console.log("Booking saved:", data);
        swal("Success", "Your booking request has been submitted!", "success");
        document.getElementById("user-form").reset(); // Clear the form
      })
      .catch((error) => {
        console.error("Error:", error);
        swal("Error", "Failed to submit your booking request. Please try again.", "error");
      });
  });
  