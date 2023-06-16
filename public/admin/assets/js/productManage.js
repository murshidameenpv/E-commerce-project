
//ADD PRODUCT
document.addEventListener("DOMContentLoaded", function () {
  const newProductForm = document.querySelector("#newProductForm");
  const loadingSpinner = document.querySelector("#loadingSpinnerAdd");
  const addProductBtn = document.querySelector("#addProductBtn");
  const messageStatus = document.querySelector("#statusMessageAdd");

  // Add event listener to reset modal fields when modal is closed
  const newProductModal = document.querySelector("#newProductModal");
  newProductModal.addEventListener("hidden.bs.modal", function () {
    // Reset form fields
    newProductForm.reset();

    // Hide status message
    messageStatus.style.display = "none";
  });

  newProductForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading spinner
    loadingSpinner.style.display = "block";

    // Disable submit button
    addProductBtn.disabled = true;

    // Create FormData object with form data
    const formData = new FormData(this);

    // Make Axios request
    axios
      .post("/api/admin/product/add-product", formData, {
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
        newProductForm.reset();

        // Enable submit button
        addProductBtn.disabled = false;

        // Reload the table
        axios.get(window.location.href).then(function (response) {
          const ordersTableContent = document.querySelector(
            "#product-table-tab-content"
          );
          const newContent = document.createElement("div");
          newContent.innerHTML = response.data;
          ordersTableContent.innerHTML = newContent.querySelector(
            "#product-table-tab-content"
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
        messageStatus.textContent = "Error adding product. Please try again.";
        messageStatus.style.display = "block";

        // Enable submit button
        addProductBtn.disabled = false;
      });
  });
});



//UPDATE PRODUCT

document.addEventListener("DOMContentLoaded", function () {
  // Add a forEach loop to add an event listener to each form
  document.querySelectorAll('[data-product-id]').forEach(form => {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission

      // Get the product ID from the data-product-id attribute
      let productId = this.dataset.productId;

      // Show loading spinner
      document.querySelector("#loadingSpinnerUpdate").style.display = "block";

      // Disable submit button
      document.querySelector("#updateProductBtn").disabled = true;

      // Create FormData object with form data
      const formData = new FormData(this);

      // Make Axios request with the product ID as a query parameter
      axios
        .put(`/api/admin/product/update?productId=${productId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          // Hide loading spinner
          document.querySelector("#loadingSpinnerUpdate").style.display =
            "none";

          // Show success message on the modal
          const successMessage = document.querySelector(
            "#successMessageUpdate"
          );
          successMessage.textContent = "Product updated successfully";
          successMessage.style.display = "block";
          setTimeout(function () {
            successMessage.style.display = "none";
          }, 3000);

          // Reset form fields
          document.querySelector("#updateProductForm").reset();

          // Enable submit button
          document.querySelector("#updateProductBtn").disabled = false;

          // Reload the table
          axios.get(window.location.href).then(function (response) {
            const ordersTableContent = document.querySelector(
              "#product-table-tab-content"
            );
            const newContent = document.createElement("div");
            newContent.innerHTML = response.data;
            ordersTableContent.innerHTML = newContent.querySelector(
              "#product-table-tab-content"
            ).innerHTML;
          });
        })
        .catch(function (error) {
          console.error(error);

          // Hide loading spinner
          document.querySelector("#loadingSpinnerUpdate").style.display =
            "none";

          // Show error message on the modal
          const errorMessage = document.querySelector("#errorMessageUpdate");
          errorMessage.textContent =
            "Error updating product. Please try again.";
          errorMessage.style.display = "block";

          // Enable submit button
          document.querySelector("#updateProductBtn").disabled = false;
        });
    });
  });
});


//DELETE PRODUCT


// DELETE USER WHEN CLICK DELETE
document.addEventListener("click", function (event) {
  if (event.target.id === "userDeleteBtn") {
    event.preventDefault();
    const userId = event.target.getAttribute("data-id");

    axios
      .delete(`/api/admin/users/${userId}/delete`)
      .then(function (response) {
        if (response.data.success) {
          // Remove the deleted user element from the UI
          const userRow = event.target.closest("tr");
          userRow.parentNode.removeChild(userRow);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
