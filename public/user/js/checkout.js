document.getElementById("applyCouponBtn")?.addEventListener("click", () => {
  const couponCode = document.getElementById("coupon-box").value;
  const subTotalElement = document.querySelector("[data-total]");
  const total = subTotalElement.getAttribute("data-total");

  axios
    .post("/checkout/coupon/apply", {
      couponCode,total
    })
    .then((response) => {
      document.getElementById("couponMessage").innerHTML =
        response.data.message;
      // Only reload the page if the coupon was applied successfully
      if (response.data.success) {
        location.reload();
      }
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("couponMessage").innerHTML =
        "An error occurred while applying the coupon";
    });
});


//MAKE ORDER
document
  .querySelector("#checkout-button")
  ?.addEventListener("click", async function (event) {
    event.preventDefault();
    // Check if an address is selected
    const addressElement = document.querySelector(
      'input[name="address"]:checked'
    );
    if (!addressElement) {
      // No address is selected, show an error message
      await Swal.fire({
        title: "Error!",
        text: "Please select a delivery address",
        icon: "error",
        confirmButtonColor: "#1d4289",
      });
      return;
    }
    // Get the selected address id
    const addressId = addressElement.getAttribute("data-address-id");
    // Check if a payment method is selected
    const paymentMethodElement = document.querySelector(
      'input[name="payment"]:checked'
    );
    if (!paymentMethodElement) {
      // No payment method is selected, show an error message
      await Swal.fire({
        title: "Error!",
        text: "Please select a payment method",
        icon: "error",
        confirmButtonColor: "#1d4289",
      });
      return;
    }
    // Get the selected payment method
      const paymentMethod = paymentMethodElement.value;
      const netAmountElement = document.querySelector("#netAmount");
      const netAmount = netAmountElement.getAttribute("data-netamount")
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Once confirmed, your order will be placed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d4289",
      cancelButtonColor: "#f7ba01",
      confirmButtonText: "Yes, place my order!",
    });
    if (result.isConfirmed) {
      try {
        await axios.post("/checkout/placeOrder", {
          paymentMethod,
          addressId,
          netAmount,
        })
        .then((response) => {
              const responseData = response.data;
              Swal.fire({
                title: responseData.title,
                text: responseData.message,
                icon: responseData.icon,
                confirmButtonColor: "#1d4289",
              });
        })
      .then(() => {
          window.location.href = "/orders";
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Error placing your order",
          icon: "error",
        });
      }
    }
  });

