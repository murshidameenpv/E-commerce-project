// Add event listener to share links
document.querySelectorAll(".share-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    // Get product URL from data attribute
    const url = this.getAttribute("data-url");
    // Show SweetAlert2 modal with sharing options
    Swal.fire({
      title: "Share Product",
      html: `
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}" target="_blank"><i class="fa fa-facebook-square me-2"></i>Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}" target="_blank"><i class="fa fa-twitter-square me-2"></i>Twitter</a>
        <span id="copy-link-btn" style="cursor:pointer;"><i class="fa fa-clipboard me-2"></i>Copy to Clipboard</span>
      `,
      showConfirmButton: false,
      focusConfirm: false,
      didOpen: () => {
        // Add event listener to copy link button
        document
          .querySelector("#copy-link-btn")
          .addEventListener("click", () => {
            // Copy URL to clipboard using Clipboard API
            navigator.clipboard.writeText(url);
            // Close modal
            Swal.close();
          });
      },
    });
  });
});
