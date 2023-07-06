function goToPage(page) {
  const url = new URL(location.href);
  url.searchParams.set("page", page);
  location.href = url.toString();
}
