document.querySelector(".first").addEventListener("click", function() {
  Swal.fire({
    title: "Show Two Buttons Inside the Alert",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    confirmButtonColor: "#00ff99",
    cancelButtonColor: "#ff0099"
  });
});