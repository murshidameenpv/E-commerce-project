


//UPDATE PRODUCT
document.addEventListener("DOMContentLoaded", function () {
  // Add a forEach loop to add an event listener to each form
  document.querySelectorAll("[data-product-id]").forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Get the product ID from the data-product-id attribute
      let productId = this.dataset.productId;

      // Show loading spinner
      document.querySelector(
        `#loadingSpinnerUpdate-${productId}`
      ).style.display = "block";

      // Disable submit button
      document.querySelector(`#updateProductBtn-${productId}`).disabled = true;

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
          document.querySelector(
            `#loadingSpinnerUpdate-${productId}`
          ).style.display = "none";
          // Show success message on the modal
          const messageStatus = document.querySelector(
            `#messageStatus-${productId}`
          );
          messageStatus.classList.add("alert-success");
          messageStatus.classList.remove("alert-danger");
          messageStatus.textContent = "Product updated successfully";
          messageStatus.style.display = "block";
          setTimeout(function () {
            messageStatus.style.display = "none";
          }, 3000);

          // Reset form fields
          document.querySelector(`#updateProductForm-${productId}`).reset();

          // Enable submit button
          document.querySelector(
            `#updateProductBtn-${productId}`
          ).disabled = false;

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
          document.querySelector(
            `#loadingSpinnerUpdate-${productId}`
          ).style.display = "none";

          // Show error message on the modal
          const messageStatus = document.querySelector(
            `#messageStatus-${productId}`
          );
          messageStatus.classList.remove("alert-success");
          messageStatus.classList.add("alert-danger");
          messageStatus.textContent =
            "Error updating product. Please try again.";
          messageStatus.style.display = "block";

          // Enable submit button
          document.querySelector(
            `#updateProductBtn-${productId}`
          ).disabled = false;
        });
    });
  });
});


// Handle block/unblock button click
document.addEventListener("click", function (event) {
  if (event.target.id === "listBtn" || event.target.id === "unListBtn") {
    event.preventDefault();
    const productId = event.target.getAttribute("data-id");
    const listed = event.target.id === "listBtn";

    const url = `/api/admin/product/${productId}${
      listed ? "/block" : "/unblock"
    }`;
    axios
      .put(url)
      .then(function (response) {
        if (response.data.success) {
          if (listed) {
            event.target.id = "unListBtn";
            event.target.textContent = "Unblock";
            event.target.classList.remove("btn-success");
            event.target.classList.add("btn-danger");
            event.target.parentElement.previousElementSibling.innerHTML =
              '<span class="badge bg-danger">Blocked</span>';
          } else {
            event.target.id = "listBtn";
            event.target.textContent = "Block";
            event.target.classList.remove("btn-danger");
            event.target.classList.add("btn-success");
            event.target.parentElement.previousElementSibling.innerHTML =
              '<span class="badge bg-success">Active</span>';
          }
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});

 //DELETE PRODUCT IMAGE
                async function deleteImage(productId, imageUrl) {
                    if (confirm("Are you sure you want to delete this image?")) {
                        try {
                            const response = await axios.delete(
                                `/api/admin/product/delete-image?productId=${productId}&imageUrl=${imageUrl}`
                            );
                            if (response.data.success) {
                                console.log("product image deleted successfully");
                                // Remove image from table
                                const images = document.querySelectorAll("img");
                                images.forEach((img) => {
                                    if (img.src.includes(imageUrl)) {
                                        img.remove();
                                    }
                                });
                            } else {
                                console.log("product image not deleted");
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }