document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to "Add Coupon" button
  document
    .getElementById("addCouponBtn")
    ?.addEventListener("click", async function (event) {
      event.preventDefault();
      // Get form data
      const couponCode = document.getElementById("couponCode").value;
      const couponDescription =
        document.getElementById("coupon_description").value;
      const couponDiscount = document.getElementById("coupon_discount").value;
      const couponExpiry = document.getElementById("coupon_expiry").value;
      const minAmount = document.getElementById("coupon_minAmount").value;
      const maxAmount = document.getElementById("coupon_maxAmount").value;
      // Create data object
      const data = {
        code: couponCode,
        description: couponDescription,
        discount: couponDiscount,
        expiryDate: couponExpiry,
        minAmount: minAmount,
        maxAmount:maxAmount
      };

      // Show loading spinner and disable submit button
      const loadingSpinner = document.getElementById("loadingSpinnerCoupon");
      loadingSpinner.style.display = "block";
      const addCouponBtn = document.getElementById("addCouponBtn");
      addCouponBtn.disabled = true;

      // Make Axios POST request
      axios
        .post("/api/admin/coupon/add-coupon", data)
        .then((response) => {
          console.log(response.data);

          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show success message on the modal
          const messageStatus = document.getElementById("statusMessageCoupon");
          messageStatus.classList.add("alert-success");
          messageStatus.classList.remove("alert-danger");
          messageStatus.textContent = response.data.message;
          messageStatus.style.display = "block";
          setTimeout(function () {
            messageStatus.style.display = "none";
          }, 3000);

          // Reset form fields
          const newCouponForm = document.getElementById("newCouponForm");
          newCouponForm.reset();

          // Enable submit button
          addCouponBtn.disabled = false;

          // Reload the table
          location.reload();
        })
        .catch((error) => {
          console.error(error);

          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show error message on the modal
          const messageStatus = document.getElementById("statusMessageCoupon");
          messageStatus.classList.add("alert-danger");
          messageStatus.classList.remove("alert-success");
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            messageStatus.textContent = error.response.data.message;
          } else {
            messageStatus.textContent =
              "Error adding product. Please try again.";
          }
          messageStatus.style.display = "block";

          // Enable submit button
          addCouponBtn.disabled = false;
        });
    });

  // Add event listener to reset modal fields when modal is closed
  const newCouponModal = document.querySelector("#newCouponModal");
  newCouponModal?.addEventListener("hidden.bs.modal", function () {
    // Reset form fields
    const newCouponForm = document.getElementById("newCouponForm");
    newCouponForm.reset();

    // Hide status message
    const messageStatus = document.getElementById("statusMessageCoupon");
    messageStatus.style.display = "none";
  });
});


// Add event listeners to the activate and deactivate buttons
document.querySelectorAll("#activateBtn, #deactivateBtn").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    // Get the coupon ID from the data attribute
    const couponId = event.target.getAttribute("data-id");
    // Determine the action based on the button ID
    const action = event.target.id === "activateBtn" ? "activate" : "deactivate";
    try {
      // Make an axios call to the API route
      const response = await axios.put(`/api/admin/coupon/${couponId}/${action}`);
      if (response.data.success) {
        // Update the button and status text
        if (action === "activate") {
          event.target.textContent = "Deactivate";
          event.target.id = "deactivateBtn";
          event.target.closest("tr").querySelector(".badge").textContent = "Active";
          event.target.closest("tr").querySelector(".badge").classList.replace("bg-danger", "bg-success");
        } else {
          event.target.textContent = "Activate";
          event.target.id = "activateBtn";
          event.target.closest("tr").querySelector(".badge").textContent = "Inactive";
          event.target.closest("tr").querySelector(".badge").classList.replace("bg-success", "bg-danger");
        }
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  });
});


// Add event listeners to the delete buttons
document.querySelectorAll("#couponDeleteBtn").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    // Get the coupon ID from the data attribute
    const couponId = event.target.getAttribute("data-id");
    try {
      // Make an axios delete request to the API route
      const response = await axios.delete(`/api/admin/coupon/${couponId}/delete`);
      if (response.data.success) 
        // Remove the row from the table
        event.target.closest("tr").remove();
      
    } catch (error) {
      console.error(error);
    }
  });
});
