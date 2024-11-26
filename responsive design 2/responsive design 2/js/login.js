// Predefined usernames, passwords, and roles.
const users = {
    "Piyush": { password: "Gupta", role: "  Administrator" },
    "Chandan": { password: "Srivastava", role: "Front Desk Supervisor" },
    "Anvesha": { password: "Singh", role: "General Manager" },
    "Sneha": { password: "Saraf", role: "Revenue Manager" },
    "Abhishek": { password: "Sharma", role: "Maintenance Supervisor" }
};

function validateLogin() {
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    if (!username || !password) {
        message.style.color = "red";
        message.textContent = "Both fields are required!";
        return;
    }

    if (users[username] && users[username].password === password) {
        message.style.color = "green";
        message.textContent = `Login successful! Welcome, ${username}`;

        localStorage.setItem("username", username);
        localStorage.setItem("role", users[username].role);

        setTimeout(() => {
            window.location.href = "account.html"; 
        }, 1000);
    }   else {
        message.style.color = "red";
        message.textContent = "Invalid username or password. Please try again.";
    }
}



