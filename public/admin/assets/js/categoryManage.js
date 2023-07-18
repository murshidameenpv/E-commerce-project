//ADD CATEGORY
document.addEventListener("DOMContentLoaded", function () {
  const addCategoryForm = document.querySelector("#addCategoryForm");
  const loadingSpinner = document.querySelector("#loadingSpinnerCategory");
  const addCategoryBtn = document.querySelector("#addCategoryBtn");
  const messageStatus = document.querySelector("#statusMessageCategory");

  // Add event listener to reset modal fields when modal is closed
  const addCategoryModal = document.querySelector("#addCategoryModal");
  addCategoryModal?.addEventListener("hidden.bs.modal", function () {
    // Reset form fields
    addCategoryForm.reset();
    // Hide status message
    messageStatus.style.display = "none";
  });

  // Add event listener to submit form
  addCategoryModal?.addEventListener("shown.bs.modal", function () {
    addCategoryForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission
      // Get current value of category input
      const category = document.getElementById("categoryInput").value;
      // Show loading spinner
      loadingSpinner.style.display = "block";
      // Disable submit button
      addCategoryBtn.disabled = true;

      // Make Axios request
      axios
        .post("/api/admin/category/add-category", { category })
        .then(function (response) {
          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show success message on the modal
          messageStatus.classList.add("alert-success");
          messageStatus.classList.remove("alert-danger");
          messageStatus.textContent =  response.data.message;
          messageStatus.style.display = "block";
          setTimeout(function () {
            messageStatus.style.display = "none";
          }, 3000);

          // Reset form fields
          addCategoryForm.reset();

          // Enable submit button
          addCategoryBtn.disabled = false;
           window.location.reload();  
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
          addCategoryBtn.disabled = false;
        });
    });
  }); 
});



//UPDATE CATEGORY
document.addEventListener("DOMContentLoaded", function () {
  // Add a forEach loop to add an event listener to each form
  document.querySelectorAll("[data-category-id]").forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission
      const loadingSpinner = document.querySelector(
        `#loadingSpinnerUpdate-${this.dataset.categoryId}`
      );
      const updateCategoryBtn = document.querySelector(
        `#updateCategoryBtn-${this.dataset.categoryId}`
      );
      const messageStatus = document.querySelector(
        `#messageStatusUpdate-${this.dataset.categoryId}`
      );
      const categoryId = this.dataset.categoryId;

      loadingSpinner.style.display = "block";
      // Disable submit button
      updateCategoryBtn.disabled = true;

      // Get the updated category name from the input field
      const updatedCategoryName = document.querySelector(
        `#categoryNameUpdate-${categoryId}`
      ).value;

      axios
        .put(`/api/admin/category/update?categoryId=${categoryId}`, {
          category: updatedCategoryName,
        })
        .then(function (response) {
          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show success message on the modal
          messageStatus.classList.add("alert-success");
          messageStatus.classList.remove("alert-danger");
          messageStatus.textContent = "Category updated successfully";
          messageStatus.style.display = "block";
          setTimeout(function () {
            messageStatus.style.display = "none";
          }, 3000);

          // Enable submit button
          updateCategoryBtn.disabled = false;

          // Reload the table
          axios.get(window.location.href).then(function (response) {
            const categoryTableContent = document.querySelector(
              "#category-table-tab-content"
            );
            const newContent = document.createElement("div");
            newContent.innerHTML = response.data;
            categoryTableContent.innerHTML = newContent.querySelector(
              "#category-table-tab-content"
            ).innerHTML;
          });
        })
        .catch(function (error) {
          console.error(error);

          // Hide loading spinner
          loadingSpinner.style.display = "none";

          // Show error message on the modal
          messageStatus.classList.remove("alert-success");
          messageStatus.classList.add("alert-danger");
          messageStatus.textContent =
            "Error updating category. Please try again.";
          messageStatus.style.display = "block";

          // Enable submit button
          updateCategoryBtn.disabled = false;
        });
    });
  });
});
