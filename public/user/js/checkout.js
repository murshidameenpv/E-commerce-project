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

//make order
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
    const netAmount = netAmountElement.getAttribute("data-netamount");
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



        if (paymentMethod === "paypal") {
          // Make an axios request to the /checkout/proceedToPaypal route
          const response = await axios.post("/checkout/proceedToPaypal", {
            addressId,
            netAmount,
          });
          window.location.href = response.data.approvalUrl;

        }
        
        
        else if (paymentMethod === "razorpay") {
          // Make an axios request to the /checkout/codPlaceOrder route
          const response = await axios.post(
            "/checkout/createRazorPayOrderInstance",
            {
              netAmount,
            }
          );
          if (response.data.success) {
            // Load the Razorpay checkout form
            const options = {
              key: response.data.key_id,
              amount: response.data.amount,
              currency: "USD",
              name: "Gadgets On",
              description: "Complete payment to purchase!",
              order_id: response.data.order_id,
              handler: async function (response) {
                // Payment was successful
                // Get the payment ID and order ID from the response
                const { razorpay_payment_id, razorpay_order_id } = response;

                // Make an axios request to your server to create the order in your database
                const responseData = await axios.post("/checkout/razorpayCreateOrder", {
                  razorpay_payment_id,
                  razorpay_order_id,
                  netAmount,
                  addressId,
                });
                // Show a success message using SweetA  lert
                await Swal.fire({
                  title: "Success!",
                  text: responseData.data.message,
                  icon: responseData.data.icon,
                  confirmButtonColor: "#1d4289",
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Redirect the user to the checkout page
                    window.location.href = "/checkout";
                  }
                });
              },
              prefill: {
                name: response.data.name,
                email: response.data.email,
                contact: response.data.contact,
              },
              theme: {
                color: "##1d4289",
              },
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
          } else {
            await Swal.fire({
              title: "Error!",
              text: "Something went wrong",
              icon: "error",
              confirmButtonColor: "#1d4289",
            });
          }
          
        
        
        } else if (paymentMethod === "cod") {
          // Make an axios request to the /checkout/codPlaceOrder route
          response = await axios.post("/checkout/cod", {
            paymentMethod,
            addressId,
            netAmount,
          });
        
          const responseData = response.data;
                      Swal.fire({
              title: responseData.title,
              text: responseData.message,
              icon: responseData.icon,
              confirmButtonColor: "#1d4289",
            });
          location.reload();
        } else if (paymentMethod === "wallet") {
          // Make an axios request to the /checkout/codPlaceOrder route
          response = await axios.post("/checkout/wallet", {
            paymentMethod,
            addressId,
            netAmount,
          });
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
        Swal.fire({
          title: "Error!",
          text: "Error placing your order",
          icon: "error",
        });
      }
    }
  });
