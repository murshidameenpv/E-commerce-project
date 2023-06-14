// Handle block/unblock button click
document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("block-btn") ||
    event.target.classList.contains("unblock-btn")
  ) {
    event.preventDefault();
    const userId = event.target.getAttribute("data-id");
    const isBlocked = event.target.classList.contains("block-btn");

    const url = `/api/admin/users/${userId}${
      isBlocked ? "/block" : "/unblock"
    }`;
    axios
      .put(url)
      .then(function (response) {
        if (response.data.success) {
          if (isBlocked) {
            event.target.classList.remove("block-btn");
            event.target.classList.add("unblock-btn");
            event.target.textContent = "Unblock";
          } else {
            event.target.classList.remove("unblock-btn");
            event.target.classList.add("block-btn");
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


/// DELETE USER WHEN CLICK DELETE
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
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
;

