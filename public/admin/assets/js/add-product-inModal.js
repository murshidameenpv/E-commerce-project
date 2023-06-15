document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#newProductForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Show loading spinner
      document.querySelector("#loadingSpinner").style.display = "block";

      // Disable submit button
      document.querySelector("#addProductBtn").disabled = true;
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
          document.querySelector("#loadingSpinner").style.display = "none";
          // Show success message on the modal
          const successMessage = document.querySelector("#successMessage");
          successMessage.textContent = "Product added successfully";
          successMessage.style.display = "block";
          setTimeout(function () {
            successMessage.style.display = "none";
          }, 3000);

          // Reset form fields
          document.querySelector("#newProductForm").reset();

          // Enable submit button
          document.querySelector("#addProductBtn").disabled = false;

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
          document.querySelector("#loadingSpinner").style.display = "none";

          // Show error message on the modal
          const errorMessage = document.querySelector("#errorMessage");
          errorMessage.textContent = "Error adding product. Please try again.";
          errorMessage.style.display = "block";

          // Enable submit button
          document.querySelector("#addProductBtn").disabled = false;
        });
    });
});
