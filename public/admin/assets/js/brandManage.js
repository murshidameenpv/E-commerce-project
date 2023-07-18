document.addEventListener("DOMContentLoaded", function () {
  const addBrandForm = document.querySelector("#addBrandForm");
  const loadingSpinner = document.querySelector("#loadingSpinnerBrand");
  const addBrandBtn = document.querySelector("#addBrandBtn");
  const messageStatus = document.querySelector("#statusMessageBrand");
  const addBrandModal = document.querySelector("#addBrandModal");

  // Reset modal fields when modal is closed
  addBrandModal?.addEventListener("hidden.bs.modal", function () {
    addBrandForm.reset();
    messageStatus.style.display = "none";
  });

  // Submit form event listener
  addBrandForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(addBrandForm);
    const name = formData.get("name");
    const category = formData.get("category");

    loadingSpinner.style.display = "block";
    addBrandBtn.disabled = true;

    axios
      .post("/api/admin/brand/add-brand", { name, category })
      .then(function (response) {
        loadingSpinner.style.display = "none";

        messageStatus.classList.add("alert-success");
        messageStatus.classList.remove("alert-danger");
        messageStatus.textContent = "Brand added successfully";
        messageStatus.style.display = "block";
        setTimeout(function () {
          messageStatus.style.display = "none";
        }, 3000);

        addBrandForm.reset();
        addBrandBtn.disabled = false;

        axios.get(window.location.href).then(function (response) {
          const brandTableContent = document.querySelector(
            "#brand-table-tab-content"
          );
          const newContent = document.createElement("div");
          newContent.innerHTML = response.data;
          brandTableContent.innerHTML = newContent.querySelector(
            "#brand-table-tab-content"
          ).innerHTML;
        });
      })
      .catch(function (error) {
        console.error(error);

        loadingSpinner.style.display = "none";

        messageStatus.classList.add("alert-danger");
        messageStatus.classList.remove("alert-success");
        messageStatus.textContent = "Error adding brand. Please try again.";
        messageStatus.style.display = "block";

        addBrandBtn.disabled = false;
      });
  });
});

// DELETE BRAND WHEN CLICK DELETE
document.addEventListener("click", function (event) {
  if (event.target.id === "brandDeleteBtn") {
    event.preventDefault();
    const brandId = event.target.getAttribute("data-id");
    axios
      .delete(`/api/admin/brand/${brandId}/delete`)
      .then(function (response) {
        if (response.data.success) {
          // Remove the deleted user element from the UI
          const brandRow = event.target.closest("tr");
          brandRow.parentNode.removeChild(brandRow);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
