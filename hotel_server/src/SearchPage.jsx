import React, { useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/bookings/search?query=${query}` // Search endpoint
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async (bookingId) => {
    if (!window.confirm("Are you sure you want to check out this guest?")) return;

    try {
      const response = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: "DELETE", // DELETE endpoint
      });

      if (response.ok) {
        // Remove the deleted booking from the results
        setResults((prevResults) =>
          prevResults.filter((booking) => booking._id !== bookingId)
        );
        alert("Guest checked out successfully.");
      } else {
        console.error("Failed to check out guest.");
        alert("Error: Could not check out the guest.");
      }
    } catch (error) {
      console.error("Error checking out guest:", error);
      alert("Error: Could not check out the guest.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔍 Guest Finder</h1>
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by guest name..."
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>
      {isLoading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.resultsContainer}>
          {results.length > 0 ? (
            results.map((booking) => (
              <div key={booking._id} style={styles.resultCard}>
                <h3 style={styles.resultTitle}>
                  {booking.firstName} {booking.lastName}
                </h3>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p>
                  <strong>Arrival Date:</strong>{" "}
                  {new Date(booking.arrivalDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Departure Date:</strong>{" "}
                  {new Date(booking.departureDate).toLocaleDateString()}
                </p>
                {/* Add other fields as needed */}
                <button
                  onClick={() => handleCheckOut(booking._id)}
                  style={styles.checkOutButton}
                >
                  Check Out
                </button>
              </div>
            ))
          ) : (
            query && (
              <p style={styles.noResults}>
                No results found for "{query}"
              </p>
            )
          )}
        </div>
      )}
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
  searchBarContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "320px",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "border 0.3s ease",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
  },
  loading: {
    fontSize: "1.2rem",
    color: "#555",
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
  checkOutButton: {
    marginTop: "10px",
    padding: "10px 16px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
  },
  noResults: {
    fontSize: "1.2rem",
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
};

export default SearchPage;
