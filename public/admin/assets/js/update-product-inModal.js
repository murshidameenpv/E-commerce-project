document
  .querySelector("#updateProductForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const productId = document.querySelector("#productId").value;
    const updatedData = {
      productName: document.querySelector("#updateProductName").value,
      category: document.querySelector("#updateCategory").value,
      price: document.querySelector("#updatePrice").value,
      stock: document.querySelector("#updateStock").value,
      description: document.querySelector("#updateDescription").value,
    };

    const updatedImages = document.querySelector("#updateImage").files;
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedData)); // Include updatedData in formData

    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("images", updatedImages[i]);
    }

    axios
      .put(`/api/admin/product/update?id=${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response.data);
        document.querySelector("#updateProductForm").reset();
        const updateProductModal = new bootstrap.Modal(
          document.querySelector("#updateProductModal")
        );
        updateProductModal.hide();
      })
      .catch(function (error) {
        console.error(error);
      });
  });

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
        // Populate the modal with the retrieved product data
        document.querySelector("#productId").value = product._id;
        document.querySelector("#updateProductName").value =
          product.productName;
        document.querySelector("#updateCategory").value = product.category;
        document.querySelector("#updatePrice").value = product.price;
        document.querySelector("#updateStock").value = product.stock;
        document.querySelector("#updateDescription").value =
          product.description;

        // Populate the images in the updateImagesBox
        const imagesBox = document.querySelector("#updateImagesBox");
        imagesBox.innerHTML = ""; // Clear previous images
        product.image.forEach(function (imageUrl) {
          const imgElement = document.createElement("img");
          imgElement.src = "/" + imageUrl;
          imgElement.classList.add("update-product-image");
          imgElement.style = "width: 70px;height: 80px";
          imagesBox.appendChild(imgElement);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

// Reset form fields when the modal is closed
document
  .querySelector("#newProductModal")
  .addEventListener("hidden.bs.modal", function () {
    document.querySelector("#newProductForm").reset();
  });
