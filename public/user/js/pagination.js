function goToPage(page) {
  event.preventDefault();
  const url = new URL(location.href);
  url.searchParams.set("page", page);
  location.href = url.toString();
}
