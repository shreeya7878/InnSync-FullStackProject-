
document.querySelector(".help-button a").addEventListener("click", (event) => {
    event.preventDefault(); 
    swal({
        title: "Coming Soon!",
        text: "This feature is under development.",
        icon: "info",
    });
});


document.querySelector(".contact_form_container form").addEventListener("submit", (event) => {
    event.preventDefault();

    
    swal({
        title: "Thank you!",
        text: "We will revert to you soon!",
        icon: "success",
    }).then(() => {
        
    window.location.reload();
    });
});
