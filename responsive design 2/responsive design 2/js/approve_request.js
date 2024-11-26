const requestsContainer = document.getElementById("requests-container");

// Fetch pending booking requests
function fetchRequests() {
  fetch("http://localhost:3000/requests")
    .then((response) => response.json())
    .then((data) => {
      requestsContainer.innerHTML = ""; // Clear the container
      if (data.length === 0) {
        requestsContainer.innerHTML = "<p>No pending requests found.</p>";
        return;
      }

      // Populate the requests
      data.forEach((request) => {
        const requestCard = document.createElement("div");
        requestCard.classList.add("request-card");

        requestCard.innerHTML = `
          <h3>${request.firstName} ${request.lastName}</h3>
          <p><strong>Email:</strong> ${request.email}</p>
          <p><strong>Phone:</strong> ${request.phone}</p>
          <p><strong>Address:</strong> ${request.address.street1}, ${request.address.city}, ${request.address.state}</p>
          <p><strong>Arrival:</strong> ${request.arrivalDate} at ${request.arrivalTime}</p>
          <p><strong>Departure:</strong> ${request.departureDate} at ${request.departureTime}</p>
          <p><strong>Adults:</strong> ${request.numAdults}, <strong>Kids:</strong> ${request.numKids}</p>
          <p><strong>Payment Method:</strong> ${request.paymentMethod}</p>
          <p><strong>Special Request:</strong> ${request.specialRequest || "None"}</p>
          <button onclick="approveRequest('${request._id}')">Approve</button>
          <button onclick="deleteRequest('${request._id}')">Delete</button>
        `;

        requestsContainer.appendChild(requestCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching requests:", error);
      swal("Error", "Failed to fetch requests. Please try again.", "error");
    });
}

// Approve a request
function approveRequest(requestId) {
  fetch(`http://localhost:3000/approve/${requestId}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        swal("Success", "Booking request approved!", "success")
          .then(() => {
            window.location.reload(); // Reload the page after approving
          });
      } else {
        throw new Error("Failed to approve request");
      }
    })
    .catch((error) => {
      console.error("Error approving request:", error);
      swal("Error", "Failed to approve the request. Please try again.", "error");
    });
}

// Delete a request
function deleteRequest(requestId) {
  fetch(`http://localhost:3000/requests/${requestId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        swal("Deleted", "Booking request deleted.", "info")
          .then(() => {
            window.location.reload(); // Reload the page after deleting
          });
      } else {
        throw new Error("Failed to delete request");
      }
    })
    .catch((error) => {
      console.error("Error deleting request:", error);
      swal("Error", "Failed to delete the request. Please try again.", "error");
    });
}

// Initial fetch
fetchRequests();
