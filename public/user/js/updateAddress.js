// async function showAddress(event) {
//   const addressId = event.target.getAttribute("data-address-id");
//   document.querySelector(".checkout_1l h5").textContent =
//     "Edit delivery address";
//   document.querySelector(".button_1").textContent = "Update address";
//   document
//     .querySelector(".button_1")
//     .setAttribute("onclick", "updateAddress()");
//   document
//     .querySelector(".button_1")
//     .setAttribute("data-address-id", addressId);
//   try {
//     const response = await axios.post("/address", { addressId });
//     const responseData = response.data;
//     // Populate the form fields with the address data
//     document.querySelector("#first-name").value = responseData.firstName;
//     document.querySelector("#last-name").value = responseData.lastName;
//     document.querySelector("#postal-code").value = responseData.postalCode;
//     document.querySelector("#locality").value = responseData.locality;
//     document.querySelector("#city").value = responseData.city;
//     document.querySelector("#state").value = responseData.state;
//     document.querySelector("#address-line").value = responseData.addressLine;
//     document.querySelector("#landmark").value = responseData.landmark;
//     document.querySelector("#address-email").value = responseData.emailAddress;
//     document.querySelector("#address-phone").value = responseData.phoneNumber;
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function updateAddress() {
//   const addressId = document
//     .querySelector(".button_1")
//     .getAttribute("data-address-id");
//   const firstName = document.querySelector("#first-name").value;
//   const lastName = document.querySelector("#last-name").value;
//   const postalCode = document.querySelector("#postal-code").value;
//   const locality = document.querySelector("#locality").value;
//   const city = document.querySelector("#city").value;
//   const state = document.querySelector("#state").value;
//   const addressLine = document.querySelector("#address-line").value;
//   const landmark = document.querySelector("#landmark").value;
//   const phoneNumber = document.getElementById("address-phone").value;
//   const emailAddress = document.getElementById("address-email").value;

//   // Perform any necessary validation here

//   const result = await Swal.fire({
//     title: "Are you sure?",
//     text: "Do you want to update this address?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#1d4289",
//     cancelButtonColor: "#f7ba01",
//     confirmButtonText: "Yes, update it!",
//   });

//   if (result.isConfirmed) {
//     try {
//       const response = await axios.put(`/address/update/${addressId}`, {
//         firstName,
//         lastName,
//         postalCode,
//         locality,
//         city,
//         state,
//         addressLine,
//         landmark,
//         phoneNumber,
//         emailAddress,
//       });
//       const responseData = response.data;
//         Swal.fire({
//           title: responseData.title,
//           text: responseData.message,
//           icon: responseData.icon,
//           confirmButtonColor: "#1d4289",
//         });
//         window.location.reload();
//       } catch (error) {
//         Swal.fire({
//           title: "Error!",
//           text: "Error Updating Address",
//           icon: "error",
//           confirmButtonColor: "#1d4289",
//         });
//       }
//     }
//   }

