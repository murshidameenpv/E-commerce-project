//ADDING CATEGORY
document.addEventListener("DOMContentLoaded", function () {
  const addCategoryForm = document.querySelector("#addCategoryForm");
  const loadingSpinner = document.querySelector("#loadingSpinnerCategory");
  const addCategoryBtn = document.querySelector("#addCategoryBtn");
  const messageStatus = document.querySelector("#statusMessageCategory");

  // Add event listener to reset modal fields when modal is closed
  const addCategoryModal = document.querySelector("#addCategoryModal");
  addCategoryModal.addEventListener("hidden.bs.modal", function () {
    // Reset form fields
    addCategoryForm.reset();

    // Hide status message
    messageStatus.style.display = "none";
  });

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
        messageStatus.textContent = "Category added successfully";
        messageStatus.style.display = "block";
        setTimeout(function () {
          messageStatus.style.display = "none";
        }, 3000);

        // Reset form fields
        addCategoryForm.reset();

        // Enable submit button
        addCategoryBtn.disabled = false;

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
        messageStatus.classList.add("alert-danger");
        messageStatus.classList.remove("alert-success");
        messageStatus.textContent = "Error adding category. Please try again.";
        messageStatus.style.display = "block";

        // Enable submit button
        addCategoryBtn.disabled = false;
      });
  });
});


// DELETE USER WHEN CLICK DELETE
document.addEventListener("click", function (event) {
  if (event.target.id === "categoryDeleteBtn") {
    event.preventDefault();
    const categoryId = event.target.getAttribute("data-id");

    axios
      .delete(`/api/admin/category/${categoryId}/delete`)
      .then(function (response) {
        if (response.data.success) {
          // Remove the deleted user element from the UI
          const categoryRow = event.target.closest("tr");
          categoryRow.parentNode.removeChild(categoryRow);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
