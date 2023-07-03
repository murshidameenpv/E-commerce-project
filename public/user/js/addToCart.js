document.addEventListener("DOMContentLoaded", () => {
  // ADD TO CART
  // Get the product ID from the URL path
  const pathSegments = window.location.pathname.split("/");
  const productId = pathSegments[pathSegments.length - 1];
  // Get the "Add to Cart" button element using its ID
  const addToCartButton = document.querySelector("#addToCartBtn");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", async () => {
      // Get the quantity from the input box
      const quantityInput = document.querySelector("#productQuantity");
      const quantity = parseInt(quantityInput.value);
      try {
        const response = await axios.post("/product/addToCart", {
          productId,
          quantity,
        });
        // Access the JSON response data
        const responseData = response.data;
        // Display success message using SweetAlert
        Swal.fire({
          title: "Success!",
          text: responseData.message,
          icon: "success",
        });
        quantityInput.value = "";
      } catch (error) {
        // Display error message using SweetAlert
        Swal.fire({
          title: "Error!",
          text: "There was an issue adding the product to the cart",
          icon: "error",
        });
      }
    });
  }

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
});
