async function deleteAddress(event) {
  // Get the address ID from the data-address-id attribute of the clicked button
  const addressId = event.target.getAttribute("data-address-id");
  // Show a confirmation SweetAlert
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this address?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1d4289",
    cancelButtonColor: "#f7ba01",
    confirmButtonText: "Yes, delete it!",
  });
  if (result.isConfirmed) {
    // Make a DELETE request to the /address/delete endpoint
    try {
      const response = await axios.delete(`/address/delete/${addressId}`);
      const responseData = response.data;
      Swal.fire({
        title: responseData.title,
        text: responseData.message,
        icon: responseData.icon,
        confirmButtonColor: "#1d4289",
      });
      // Remove the deleted address from the page
      event.target.closest(".address-box").remove();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Error deleting address",
        icon: "error",
        confirmButtonColor: "#1d4289",
      });
    }
  }
}
