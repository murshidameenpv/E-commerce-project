document.querySelectorAll(".modal .btn-primary").forEach((button) => {
  button.addEventListener("click", (event) => {
    // Get the order ID associated with this modal
    const orderId = event.target.dataset.orderId;

    // Get the modal associated with this order
    const modal = document.querySelector(`#rejectOrderModal_${orderId}`);
   modal.addEventListener("hidden.bs.modal", () => {
     // Reset the input field in the modal
     const reasonInput = modal.querySelector("#reasonToReject");
     reasonInput.value = "";
   });

    // Get the reason from the input field in the modal
    const reason = modal?.querySelector("#reasonToReject").value;

    // Make an Axios call to the /api/admin/order/reject route
    axios
      .post(`/api/admin/order/reject?orderId=${orderId}`, { reason })
      .then((response) => {
        // Handle successful response
        const messageStatus = modal.querySelector("#rejectMessageStatus");
        messageStatus.textContent = response.data.message;
        messageStatus.classList.add("alert-success");
        messageStatus.style.display = "block";
        // Reload the page after a delay
        setTimeout(() => {
          location.reload();
        }, 2000);
      })
      .catch((error) => {
          console.error(error);
        const messageStatus = modal.querySelector("#rejectMessageStatus");
        messageStatus.textContent =
          "An error occurred while rejecting the order";
        messageStatus.classList.add("alert-danger");
        messageStatus.style.display = "block";
      });
  });
});
function viewOrder(orderId) {
  window.location.href = `/admin/orders/details?orderId=${orderId}`;
}


function processOrder(orderId) {
  axios
    .post(`/api/admin/order/process?orderId=${orderId}`)
    .then((response) => {
      // Handle successful response
      location.reload();
    })
    .catch((error) => {
      // Handle error response
      console.error(error);
    });
}
function shipOrder(orderId) {
  axios
    .post(`/api/admin/order/ship?orderId=${orderId}`)
    .then((response) => {
      // Handle successful response
      location.reload();
    })
    .catch((error) => {
      // Handle error response
      console.error(error);
    });
}
function deliverOrder(orderId) {
  axios
    .post(`/api/admin/order/deliver?orderId=${orderId}`)
    .then((response) => {
      // Handle successful response
      location.reload();
    })
    .catch((error) => {
      // Handle error response
      console.error(error);
    });
}
function refundOrder(orderId) {
  if (confirm("Are you sure you want to refund this order?")) {
    axios
      .post(`/api/admin/order/refund?orderId=${orderId}`)
      .then((response) => {
        // Handle successful response
        if (response.data.success) {
          location.reload();
        }
      })
      .catch((error) => {
        // Handle error response
        console.error(error);
      });
  }
}

