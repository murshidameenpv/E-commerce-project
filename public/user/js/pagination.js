function goToPage(page) {
    console.log("000000000000000000000");
  const url = new URL(location.href);
  url.searchParams.set("page", page);
  location.href = url.toString();
}
