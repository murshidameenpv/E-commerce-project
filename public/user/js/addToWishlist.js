document.addEventListener("DOMContentLoaded", () => {
  const addToWishlistBtn = document.querySelector("#addToWishlistBtn");
    if (addToWishlistBtn) {
    addToWishlistBtn.addEventListener("click", async () => {
      const productId =
        document.querySelector("#addToWishlistBtn").dataset.productId;
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to add this item to your wishlist?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1d4289",
        cancelButtonColor: "#f7ba01",
        confirmButtonText: "Yes, add it!",
      });
      if (result.isConfirmed) {
        try {
          const response = await axios.post("/wishlist/product/addtowishlist", {
            productId,
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
  }
});
