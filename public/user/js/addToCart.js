document.addEventListener("DOMContentLoaded", () => {
     const addToCartBtn = document.querySelector("#addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      const productId = document.querySelector("#addToCartBtn").dataset.productId;
      const quantity = parseInt(document.querySelector("#productQuantity").value);
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to add this item to your cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1d4289",
        cancelButtonColor: "#f7ba01",
        confirmButtonText: "Yes, add it!",
      });
      if (result.isConfirmed) {
        try {
          const response = await axios.post("/product/addToCart", {
            productId,
            quantity,
          });
          const responseData = response.data;
          Swal.fire({
            title: responseData.title,
            text: responseData.message,
            icon: responseData.icon,
            confirmButtonColor: "#1d4289",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Error Adding to wishlist",
            icon: "error",
          });
        }
      }
    });
    // CHECK THE QUANTITY NUMBER is NEGATIVE OR FRACTION
    const quantityInput = document.querySelector("#productQuantity");
    if (quantityInput) {
      quantityInput.addEventListener("input", () => {
        // Get the current value of the input element
        let value = parseFloat(quantityInput.value);
        // Check if the value is negative or fractional
        if (value < 1 || !Number.isInteger(value)) {
          // Update the value to 1
          quantityInput.value = 1;
        }
      });
    }
  }
});