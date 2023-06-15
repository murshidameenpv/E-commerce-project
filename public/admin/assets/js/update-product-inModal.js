document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#updateProductForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Get the product ID
      let productId = document.querySelector("#productId").value;

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
          document.querySelector("#loadingSpinnerUpdate").style.display = "none";

          // Show success message on the modal
          const successMessage = document.querySelector("#successMessageUpdate");
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
          document.querySelector("#loadingSpinnerUpdate").style.display = "none";

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
