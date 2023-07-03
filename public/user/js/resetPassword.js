const resetForm = document.querySelector("#resetPasswordForm");
if (resetForm) {
  resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const password = document.querySelector("#password").value;
    const repeatPassword = document.querySelector("#repeatPassword").value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    if (password === repeatPassword) {
      if (passwordRegex.test(password)) {
        axios
          .post("/login/resetPassword", { token, password })
          .then((response) => {
            // handle successful response
            const msg = document.querySelector("#msg");
            msg.textContent = response.data;
            setTimeout(() => {
              window.location.href = "/login";
            }, 3000);
          })
          .catch((error) => {
            // handle error
            console.error(error);
          });
      } else {
        // handle invalid password
        const msg = document.querySelector("#msg");
        msg.textContent =
          "Password must contain at least one letter, one number, and be at least 4 characters long";
      }
    } else {
      // handle password mismatch
      const msg = document.querySelector("#msg");
      msg.textContent = "Passwords do not match";
    }
  });
}