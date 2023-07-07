
const removeFromWishlist = document.querySelectorAll(".remove-wishlist-product");
removeFromWishlist.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    const productId = button.getAttribute("data-wishlist-product-id");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#1d4289",
      cancelButtonColor: "#f7ba01"
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.post("/wishlist/product/remove", {
          productId,
        });
        Swal.fire("Removed!",
          response.data.message,
          "success",
        );
        // Remove the product elements from the page
        const detailsElement = button.closest(".col-md-9");
        const imageElement = detailsElement.previousElementSibling;
        detailsElement.remove();
        imageElement.remove();
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an issue removing the product from your wishlist.",
          "error"
        );
      }
    }
  });
});
