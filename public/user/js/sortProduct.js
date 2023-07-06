function sortProducts(sortOption) {
  const url = new URL(location.href);
  url.searchParams.set("sortOption", sortOption);
  location.href = url.toString();
}

