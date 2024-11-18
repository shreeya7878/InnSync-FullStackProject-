function showConfirmation(event) {
    event.preventDefault(); // Prevents the default form submission
    alert("Thank you for your booking request! You will be notified soon regarding the status of your booking.");
    location.reload(); // Reloads the page after the alert is acknowledged
}