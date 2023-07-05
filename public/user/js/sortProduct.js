function sortProducts(sortOption) {
  const urlParams = new URLSearchParams(window.location.search);
  const category_id = urlParams.get("category_id");
  const brand_id = urlParams.get("brand_id");
  if (brand_id) {
    window.location.href = `/products/brands?brand_id=${brand_id}&page=1&sortOption=${sortOption}`;
  } else {
    window.location.href = `/products/category?category_id=${category_id}&page=1&sortOption=${sortOption}`;
  }
}
