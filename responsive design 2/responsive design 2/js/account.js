
function displayWelcomeMessage() {
    
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (username && role) {
        const welcomeMessage = `Welcome, ${username}! Your role: ${role}`;
        document.getElementById("welcomeMessage").textContent = welcomeMessage;
    } else {
        document.getElementById("welcomeMessage").textContent = "Welcome, Guest!";
    }
}
window.onload = displayWelcomeMessage;


