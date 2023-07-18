function getAddressDataToAdd() {
  const firstName = document.querySelector("#first-name").value;
  const lastName = document.querySelector("#last-name").value;
  const postalCode = document.querySelector("#postal-code").value;
  const locality = document.querySelector("#locality").value;
  const city = document.querySelector("#city").value;
  const state = document.querySelector("#state").value;
  const addressLine = document.querySelector("#address-line").value;
  const landmark = document.querySelector("#landmark").value;
  const phoneNumber = document.getElementById("address-phone").value;
  const emailAddress = document.getElementById("address-email").value;
  return {
    firstName,
    lastName,
    postalCode,
    locality,
    city,
    state,
    addressLine,
    landmark,
    phoneNumber,
    emailAddress,
  };
}
function getAddressDataToUpdate(){
  const firstName = document.querySelector("#first-name_update").value;
  const lastName = document.querySelector("#last-name_update").value;
  const postalCode = document.querySelector("#postal-code_update").value;
  const locality = document.querySelector("#locality_update").value;
  const city = document.querySelector("#city_update").value;
  const state = document.querySelector("#state_update").value;
  const addressLine = document.querySelector("#address-line_update").value;
  const landmark = document.querySelector("#landmark_update").value;
  const phoneNumber = document.getElementById("address-phone_update").value;
  const emailAddress = document.getElementById("address-email_update").value;
  return {
    firstName,
    lastName,
    postalCode,
    locality,
    city,
    state,
    addressLine,
    landmark,
    phoneNumber,
    emailAddress,
  };
}
function validateAddressData(data) {
  if (
    !data.firstName ||
    !data.lastName ||
    !data.postalCode ||
    !data.locality ||
    !data.city ||
    !data.state ||
    !data.addressLine ||
    !data.landmark ||
    !data.phoneNumber ||
    !data.emailAddress
  ) {
    Swal.fire({
      title: "Error!",
      text: "Enter all details",
      icon: "error",
      confirmButtonColor: "#1d4289",
    });
    return false;
  } else if (!/^\d{10}$/.test(data.phoneNumber)) {
    Swal.fire({
      title: "Error!",
      text: "Enter a 10 digit mobile number",
      icon: "error",
      confirmButtonColor: "#1d4289",
    });
    return false;
  } else if (!/^\d{6}$/.test(data.postalCode)) {
    Swal.fire({
      title: "Error!",
      text: "Enter a valid 6-digit postal code",
      icon: "error",
      confirmButtonColor: "#1d4289",
    });
    return false;
  } else if (
    !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      data.emailAddress
    )
  ) {
    Swal.fire({
      title: "Error!",
      text: "Enter a valid email address",
      icon: "error",
      confirmButtonColor: "#1d4289",
    });
    return false;
  }

  return true;
}

async function addAddress() {
  const data = getAddressDataToAdd();
  if (validateAddressData(data)) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d4289",
      cancelButtonColor: "#f7ba01",
      confirmButtonText: "Yes, add it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post("/address/add", data);
        const responseData = response.data;
        Swal.fire({
          title: responseData.title,
          text: responseData.message,
          icon: responseData.icon,
          confirmButtonColor: "#1d4289",
        });
        // Only redirect to the /checkout route if the address was successfully added
        if (responseData.icon === "success") {
          window.location.href = "/checkout";
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Error Adding new address",
          icon: "error",
          confirmButtonColor: "#1d4289",
        });
      }
    }
  }
}


function deleteAddress(addressId) {
  // Show a confirmation dialog
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1d4289",
    cancelButtonColor: "#f7ba01",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Make the Axios delete request if confirmed
      axios
        .delete(`/address/delete/${addressId}`)
        .then((response) => {
          // Show the response data in a SweetAlert
          Swal.fire(
            response.data.title,
            response.data.message,
            response.data.icon,
          ).then(() => {
            // Reload the page after clicking OK
            location.reload();
          });
        })
        .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "Error deleting  address",
          icon: "error",
          confirmButtonColor: "#1d4289",
        });
        });
    }
  });
}


 function updateAddressRender(addressId) {
   window.location.href = `/address/update?addressId=${addressId}`;
}
 

async function updateAddress(addressId) {
  const data = getAddressDataToUpdate();
  if (validateAddressData(data)) {
    try {
      const response = await axios.post(`/address/update/${addressId}`, data);
      const responseData = response.data;
      Swal.fire({
        title: responseData.title,
        text: responseData.message,
        icon: responseData.icon,
        confirmButtonColor: "#1d4289",
      });
      if (responseData.icon === "success") {
        window.location.href = "/checkout";
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Error updating address",
        icon: "error",
        confirmButtonColor: "#1d4289",
      });
    }
  }
}