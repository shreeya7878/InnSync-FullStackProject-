import React, { useState, useEffect } from "react";

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [whereNeeded, setWhereNeeded] = useState('');

  // Fetch all inventory items when the component mounts
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:3000/inventory");
        const data = await response.json();
        setInventory(data); // Set the fetched inventory data to state
      } catch (error) {
        setError("Failed to fetch inventory data.");
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Handle form submission for adding inventory item
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!itemName || quantity <= 0 || !whereNeeded) {
      alert("Please fill in all fields with valid values.");
      return;
    }

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
        setInventory((prev) => [...prev, data]); // Add new item to inventory state
        setItemName('');
        setQuantity('');
        setWhereNeeded('');
      } else {
        alert("Failed to save item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 Inventory List</h1>
      {isLoading ? (
        <p style={styles.loading}>Loading inventory...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.resultsContainer}>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <div key={item._id} style={styles.resultCard}>
                <h3 style={styles.resultTitle}>{item.itemName}</h3>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Where Needed:</strong> {item.whereNeeded}</p>
                {/* Add other fields as necessary */}
              </div>
            ))
          ) : (
            <p style={styles.noResults}>No inventory data found.</p>
          )}
        </div>
      )}
      
      {/* Form to add inventory */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Where Needed"
          value={whereNeeded}
          onChange={(e) => setWhereNeeded(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Item</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f9fafc",
    minHeight: "100vh",
    fontFamily: '"Poppins", Arial, sans-serif',
    color: "#333",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "600",
    color: "#222",
    marginBottom: "25px",
    textAlign: "center",
  },
  loading: {
    fontSize: "1.2rem",
    color: "#555",
    fontStyle: "italic",
  },
  error: {
    fontSize: "1.2rem",
    color: "#d9534f",
    fontStyle: "italic",
  },
  resultsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "900px",
  },
  resultCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(229, 231, 235, 0.8)",
  },
  resultTitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#0056b3",
    marginBottom: "12px",
  },
  noResults: {
    fontSize: "1.2rem",
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
    marginTop: "30px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
  },
};

export default InventoryPage;
