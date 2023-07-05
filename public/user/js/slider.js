const priceSlider = document.getElementById("price-slider");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");

noUiSlider.create(priceSlider, {
  start: [0, 10000],
  connect: true,
  range: {
    min: 0,
    max: 10000,
  },
});

priceSlider.noUiSlider.on("update", function (values, handle) {
  if (handle === 0) {
    minPrice.innerHTML = parseInt(values[handle]);
  } else {
    maxPrice.innerHTML = parseInt(values[handle]);
  }
});
