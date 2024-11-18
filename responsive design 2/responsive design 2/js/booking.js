document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form"); 

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        
        swal({
            title: "Good job!",
            text: "You have booked a room for guest",
            icon: "success",
        }).then(() => {
            
            window.location.reload();
        });
    });
});
