document.addEventListener("DOMContentLoaded", function () {
  const addBrandForm = document.querySelector("#addBrandForm");
  const loadingSpinner = document.querySelector("#loadingSpinnerBrand");
  const addBrandBtn = document.querySelector("#addBrandBtn");
  const messageStatus = document.querySelector("#statusMessageBrand");

  // Add event listener to reset modal fields when modal is closed
  const addBrandModal = document.querySelector("#addBrandModal");
  addBrandModal?.addEventListener("hidden.bs.modal", function () {
    // Reset form fields
    addBrandForm.reset();
    // Hide status message
    messageStatus.style.display = "none";
  });

  // Add event listener to submit form
  addBrandModal?.addEventListener("shown.bs.modal", function () {
    addBrandForm.addEventListener("submit", function (event) {
      event.preventDefault();
        const formData = new FormData(addBrandForm);
         const name = formData.get("name");
        const category = formData.get("category"); 
      loadingSpinner.style.display = "block";
      addBrandBtn.disabled = true;
      // Make Axios request
      axios
        .post("/api/admin/brand/add-brand", {name,category})
        .then(function (response) {
          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show success message on the modal
          messageStatus.classList.add("alert-success");
          messageStatus.classList.remove("alert-danger");
          messageStatus.textContent = "Brand added successfully";
          messageStatus.style.display = "block";
          setTimeout(function () {
            messageStatus.style.display = "none";
          }, 3000);

          // Reset form fields
          addBrandForm.reset();

          // Enable submit button
          addBrandBtn.disabled = false;

          // Reload the table
          axios.get(window.location.href).then(function (response) {
            const brandTableContent = document.querySelector(
              "#brand-table-tab-content"
            );
            const newContent = document.createElement("div");
            newContent.innerHTML = response.data;
            brandTableContent.innerHTML = newContent.querySelector(
              "#brand-table-tab-content"
            ).innerHTML;
          });
        })
        .catch(function (error) {
          console.error(error);

          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show error message on the modal
          messageStatus.classList.add("alert-danger");
          messageStatus.classList.remove("alert-success");
          messageStatus.textContent =
            "Error adding category. Please try again.";
          messageStatus.style.display = "block";

          // Enable submit button
          addBrandBtn.disabled = false;
        });
    });
  });
});


// DELETE BRAND WHEN CLICK DELETE
document.addEventListener("click", function (event) {
  if (event.target.id === "brandDeleteBtn") {
    event.preventDefault();
    const brandId = event.target.getAttribute("data-id");
    axios
      .delete(`/api/admin/brand/${brandId}/delete`)
      .then(function (response) {
        if (response.data.success) {
          // Remove the deleted user element from the UI
          const brandRow = event.target.closest("tr");
          brandRow.parentNode.removeChild(brandRow);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
