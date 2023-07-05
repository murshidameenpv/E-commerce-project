document.addEventListener("DOMContentLoaded", () => {
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
      // Get the stock from the data attribute
      const stock = parseInt(addToCartButton.getAttribute("data-stock"));
      // Send a request to check if the product is already in the cart
      try {
        const cartResponse = await axios.get("/product/checkCart", {
          params: {
            productId: productId, // Pass the product ID in the request query params
          },
        });
        const cartData = cartResponse.data;
        const inCart = cartData.inCart;
        const cartQuantity = cartData.cartQuantity;
        if (inCart) {
          // Product is already in the cart
          if (quantity + cartQuantity > stock) {
            // Display error message using SweetAlert
            Swal.fire({
              title: "Error!",
              text: "Adding this quantity exceeds the available stock. Please adjust the quantity.",
              icon: "error",
            });
            return; // Stop execution if adding the quantity exceeds the stock
          } else {
            try {
              // Make the request to add the product to the cart
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
              // Reset the quantity input to 1
              quantityInput.value = "1";
            } catch (error) {
              // Display error message using SweetAlert
              Swal.fire({
                title: "Error!",
                text: "There was an issue adding the product to the cart",
                icon: "error",
              });
            }
          }
        } else {
          // Product is not in the cart
          if (quantity > stock) {
            // Display error message using SweetAlert
            Swal.fire({
              title: "Error!",
              text: "Invalid stock. The entered quantity exceeds the available stock.",
              icon: "error",
            });
            return; // Stop execution if the entered quantity exceeds the stock
          } else {
            try {
              // Make the request to add the product to the cart
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
              // Reset the quantity input to 1
              quantityInput.value = "1";
            } catch (error) {
              // Display error message using SweetAlert
              Swal.fire({
                title: "Error!",
                text: "There was an issue adding the product to the cart",
                icon: "error",
              });
            }
          }
        }
      } catch (error) {
        // Display error message using SweetAlert
        Swal.fire({
          title: "Error!",
          text: "There was an issue checking the cart. Please try again.",
          icon: "error",
        });
        return; // Stop execution if there's an error checking the cart
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
