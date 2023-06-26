const resetForm = document.querySelector("#resetPasswordForm");
resetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const password = document.querySelector("#password").value;
  const repeatPassword = document.querySelector("#repeatPassword").value;
  if (password === repeatPassword) {
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
    // handle password mismatch
    const msg = document.querySelector("#msg");
    msg.textContent = "Passwords do not match";
  }
});
