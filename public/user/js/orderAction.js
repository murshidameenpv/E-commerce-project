function viewOrder(orderId) {
  window.location.href = `/admin/orders/details?orderId=${orderId}`;
}

async function cancelOrder(orderId) {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d4289",
      cancelButtonColor: "#f7ba01",
      confirmButtonText: "Yes, cancel it!",
    });
    if (result.isConfirmed) {
      const response = await axios.post(`/order/cancel?orderId=${orderId}`);
      const responseData = response.data;
      Swal.fire({
        title: responseData.title,
        text: responseData.message,
        icon: responseData.icon,
        confirmButtonColor: "#1d4289",
      });
      location.reload();
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error!",
      text: "Error canceling order",
      icon: "error",
    });
  }
}

async function returnOrder(orderId) {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to return  this item ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d4289",
      cancelButtonColor: "#f7ba01",
      confirmButtonText: "Yes, return it!",
    });
    if (result.isConfirmed) {
      const response = await axios.post(`/order/return?orderId=${orderId}`);
      const responseData = response.data;
      Swal.fire({
        title: responseData.title,
        text: responseData.message,
        icon: responseData.icon,
        confirmButtonColor: "#1d4289",
      });
      location.reload();
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error!",
      text: "Error returning order",
      icon: "error",
    });
  }
}
