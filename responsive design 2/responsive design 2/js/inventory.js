const itemForm = document.getElementById("itemForm");
const inventoryTableBody = document.querySelector("#inventoryTable tbody");
let submitButton;

// Listen for form submission to add item to the table and database
itemForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const inputs = itemForm.querySelectorAll("input");
  const itemName = inputs[0].value;
  const quantity = inputs[1].value;
  const whereNeeded = inputs[2].value;

  // Validate input fields
  if (!itemName || quantity <= 0 || !whereNeeded) {
    alert("Please fill in all fields with valid values.");
    return;
  }

  // Create a new row in the inventory table
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
      <td>${itemName}</td>
      <td>${quantity}</td>
      <td>${whereNeeded}</td>
  `;
  inventoryTableBody.appendChild(newRow);

  // Clear input fields
  inputs.forEach(input => input.value = "");

  // If it's the first item added, create the Submit button
  if (!submitButton) {
    createSubmitButton();
  }

  // Send the item data to the server
  try {
    const response = await fetch("http://localhost:3000/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemName,
        quantity,
        whereNeeded,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Data saved:", data);
    } else {
      console.error("Error saving data:", data);
    }
  } catch (error) {
    console.error("Error communicating with the server:", error);
  }
});

// Create and append the Submit button after adding the first inventory item
function createSubmitButton() {
  submitButton = document.createElement("button");
  submitButton.textContent = "Submit Inventory";
  submitButton.style.marginTop = "20px";

  submitButton.addEventListener("click", () => {
    swal({
      title: "Are you sure?",
      text: "Once submitted, changes cannot be reverted!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        swal("Inventory submitted successfully!", {
          icon: "success",
        }).then(() => {
          window.location.reload(); // Reload page after successful submit
        });
      }
    });
  });

  document.querySelector("main").appendChild(submitButton);
}
