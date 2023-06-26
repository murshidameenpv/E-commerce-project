document.addEventListener("DOMContentLoaded", function () {
  const newBannerForm = document.querySelector("#newBannerForm");
  const loadingSpinner = document.querySelector("#loadingSpinnerBanner");
  const addBannerBtn = document.querySelector("#addBannerBtn");
  const messageStatus = document.querySelector("#statusMessageBanner");

  // Add event listener to reset modal fields when modal is closed
  const newBannerModal = document.querySelector("#newBannerModal");
  newBannerModal?.addEventListener("hidden.bs.modal", function () {
    // Reset form fields
    newBannerModal.reset();
    // Hide status message
    messageStatus.style.display = "none";
  }); 
  // Add event listener to submit form
  newBannerModal?.addEventListener("shown.bs.modal", function () {
    newBannerForm?.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission
      // Show loading spinner
      loadingSpinner.style.display = "block";
      // Disable submit button
      addBannerBtn.disabled = true;
      // Create FormData object with form data
      const formData = new FormData(this);
      axios
        .post("/api/admin/product/add-banner", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show success message on the modal
          messageStatus.classList.add("alert-success");
          messageStatus.classList.remove("alert-danger");
          messageStatus.textContent = "Product added successfully";
          messageStatus.style.display = "block";
          setTimeout(function () {
            messageStatus.style.display = "none";
          }, 3000);

          // Reset form fields
          newBannerForm.reset();

          // Enable submit button
          addBannerBtn.disabled = false;

          // Reload the table
          location.reload();
        })
        .catch(function (error) {
          console.error(error);

          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show error message on the modal
          messageStatus.classList.add("alert-danger");
          messageStatus.classList.remove("alert-success");
          messageStatus.textContent = "Error adding product. Please try again.";
          messageStatus.style.display = "block";

          // Enable submit button
          addBannerBtn.disabled = false;
        });
    });
  });
});

// DELETE CATEGORY WHEN CLICK DELETE
document.addEventListener("click", function (event) {
  if (event.target.id === "bannerDeleteBtn") {
    event.preventDefault();
    const bannerId = event.target.getAttribute("data-id");
    axios
      .delete(`/api/admin/banner/${bannerId}/delete`)
      .then(function (response) {
        if (response.data.success) {
          // Remove the deleted user element from the UI
          const bannerRow = event.target.closest("tr");
          bannerRow.parentNode.removeChild(bannerRow);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});

