function getAddressData() {
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
  const data = getAddressData();

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
        window.location.reload();
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
  async function updateAddress() {
    const addressId = document
      .querySelector(".button_1")
      .getAttribute("data-address-id");
    const data = getAddressData();
    if (validateAddressData(data)) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update this address?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1d4289",
        cancelButtonColor: "#f7ba01",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.put(`/address/update/${addressId}`, data);
          const responseData = response.data;
          Swal.fire({
            title: responseData.title,
            text: responseData.message,
            icon: responseData.icon,
            confirmButtonColor: "#1d4289",
          });
          window.location.reload();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Error Updating Address",
            icon: "error",
            confirmButtonColor: "#1d4289",
          });
        }
      }
    }
  }


function setAddressData(data) {
  document.querySelector("#first-name").value = data.firstName;
  document.querySelector("#last-name").value = data.lastName;
  document.querySelector("#postal-code").value = data.postalCode;
  document.querySelector("#locality").value = data.locality;
  document.querySelector("#city").value = data.city;
  document.querySelector("#state").value = data.state;
  document.querySelector("#address-line").value = data.addressLine;
  document.querySelector("#landmark").value = data.landmark;
  document.querySelector("#address-email").value = data.emailAddress;
  document.querySelector("#address-phone").value = data.phoneNumber;
}


async function showAddress(event) {
  const addressId = event.target.getAttribute("data-address-id");
  document.querySelector(".checkout_1l h5").textContent =
    "Edit delivery address";
  document.querySelector(".button_1").textContent = "Update address";
  document
    .querySelector(".button_1")
    .setAttribute("onclick", "updateAddress()");
  document
    .querySelector(".button_1")
    .setAttribute("data-address-id", addressId);

  try {
    const response = await axios.post("/address", { addressId });
    const responseData = response.data;
  
    setAddressData(responseData);
  } catch (error) {
    console.error(error);
  }
}