//Get Product in Modal
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-product")) {
    const productId = event.target.getAttribute("data-product-id");

    axios
      .get("/api/admin/product", {
        params: { id: productId },
      })
      .then(function (response) {
        const product = response.data;

        // Populate the images in the updateImagesBox
        const imagesBox = document.querySelector("#updateImagesBox");
        imagesBox.innerHTML = ""; // Clear previous images
        product.image.forEach(function (imageUrl) {
          const imgElement = document.createElement("img");
          imgElement.src = "/" + imageUrl;
          imgElement.classList.add("update-product-image");
          imgElement.style = "width: 70px;height: 80px";
          imagesBox.appendChild(imgElement);

          // Populate the modal with the retrieved product data
          document.querySelector("#productId").value = product._id;
          document.querySelector("#updateProductName").value =
            product.productName;
          document.querySelector("#updateCategory").value = product.category;
          document.querySelector("#updatePrice").value = product.price;
          document.querySelector("#updateStock").value = product.stock;
          document.querySelector("#updateDescription").value =
            product.description;
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#updateProductForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Show loading spinner
      document.querySelector("#loadingSpinner").style.display = "block";
      // Disable submit button
      document.querySelector("#updateProductBtn").disabled = true;
      const productId = document.querySelector("#productId").value;
      // Create FormData object with form data
      const formData = new FormData(this);
      console.log(JSON.stringify(formData), "aaaaaaa");
      formData.append("productId", productId);
      // Make Axios request
      axios
        .post("/api/admin/product/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          // Hide loading spinner
          document.querySelector("#loadingSpinner").style.display = "none";
          // Show success message on the modal
          const successMessage = document.querySelector("#successMessage");
          successMessage.textContent = "Product Updated successfully";
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

//Reset form fields when the modal is closed
document
  .querySelector("#updateProductModal")
  .addEventListener("hidden.bs.modal", function () {
    document.querySelector("#updateProductForm").reset();
  });
