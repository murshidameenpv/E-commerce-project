// HANDLE BLOCK_UNBLOCK USER
document.addEventListener("click", function (event) {
  if (event.target.id === "userBlockBtn" || event.target.id === "userUnBlockBtn") {
    event.preventDefault();
    const userId = event.target.getAttribute("data-id");
    const isBlocked = event.target.id === "userBlockBtn";

    const url = `/api/admin/users/${userId}${
      isBlocked ? "/block" : "/unblock"
    }`;
    axios
      .put(url)
      .then(function (response) {
        if (response.data.success) {
          if (isBlocked) {
            event.target.id = "userUnBlockBtn";
            event.target.textContent = "Unblock";
          } else {
            event.target.id = "userBlockBtn";
            event.target.textContent = "Block";
          }
          axios.get(location.href).then(function (response) {
            const usersTable = document.querySelector("#usersTable");
            const newContent = document.createElement("div");
            newContent.innerHTML = response.data;
            usersTable.innerHTML =
              newContent.querySelector("#usersTable").innerHTML;
          });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});




// DELETE USER WHEN CLICK DELETE
document.addEventListener("click", function (event) {
  if (event.target.id === "userDeleteBtn") {
    event.preventDefault();
    const userId = event.target.getAttribute("data-id");

    axios
      .delete(`/api/admin/users/${userId}/delete`)
      .then(function (response) {
        if (response.data.success) {
          // Remove the deleted user element from the UI
          const userRow = event.target.closest("tr");
          userRow.parentNode.removeChild(userRow);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
