// Script for forgot password
const forgotForm = document.querySelector("#forgotPasswordForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    axios
      .post("/login/forgotPassword", { email })
      .then((response) => {
        // handle successful response
        Toastify({
          text: response.data,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right,#0d6efd, #ffc107)",
        }).showToast();
        // redirect to login page after 3 seconds if email was found
        if (response.data !== "Email Not Found") {
          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);
        }
      })
      .catch((error) => {
        // handle error
        console.error(error);
      });
  });
}
