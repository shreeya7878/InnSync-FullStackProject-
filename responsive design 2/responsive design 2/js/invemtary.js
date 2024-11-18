const itemForm = document.getElementById("itemForm");
const inventoryTableBody = document.querySelector("#inventoryTable tbody");
let submitButton;

itemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get input values
    const inputs = itemForm.querySelectorAll("input");
    const itemName = inputs[0].value;
    const quantity = inputs[1].value;
    const whereNeeded = inputs[2].value;

    // Validate inputs
    if (!itemName || quantity <= 0 || !whereNeeded) {
        alert("Please fill in all fields with valid values.");
        return;
    }

    // Add a new row to the inventory table
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${itemName}</td>
        <td>${quantity}</td>
        <td>${whereNeeded}</td>
    `;
    inventoryTableBody.appendChild(newRow);

    // Clear input fields
    inputs.forEach(input => input.value = "");

    // Create the submit button if not already created
    if (!submitButton) {
        createSubmitButton();
    }
});

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
                    
                    window.location.reload();
                });
            } 
        });
    });

    document.querySelector("main").appendChild(submitButton);
}
