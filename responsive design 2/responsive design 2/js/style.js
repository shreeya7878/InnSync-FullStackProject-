
document.querySelector(".help-button a").addEventListener("click", (event) => {
    event.preventDefault(); 
    alert("This feature is coming soon!");
});
document.querySelector(".contact_form_container form").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("We will revert you soon!");
    
    setTimeout(() => {
        window.location.reload();
    }, 1000);
});
