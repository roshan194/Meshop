document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Unauthorized! Please login first.");
    window.location.href = "../login";
    return;
  }
  const productListContainer = document.getElementById("product-list");
  const categoryCheckboxes = document.querySelectorAll('aside input[type="checkbox"]');
  const priceRangeInput = document.querySelector('aside input[type="range"]');
  const filterButtons = document.querySelectorAll('.filters .filter');

  let selectedCategories = [];
  let selectedPrice = 1000;
  let priceSort = 'all';

  let colors = ["red", "green", "yellow", "blue", "black"];
  let sizes = ["xs", "s", "m", "l", "xl"];

  let selectedColors = [];
  let selectedSizes = [];




  // Fetch and render products
  fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((products) => {
    // Inject random colors and sizes into each product
    let newProducts = products.map((item) => {
      item.colors = colors.slice(0, Math.floor(Math.random() * colors.length) + 1);
      item.sizes = sizes.slice(0, Math.floor(Math.random() * sizes.length) + 1);
      return item;
    });

    newProducts.forEach((product) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.setAttribute("data-category", product.category.toLowerCase());
      item.setAttribute("data-price", product.price);
      item.setAttribute("data-colors", product.colors.join(","));
      item.setAttribute("data-sizes", product.sizes.join(","));

      // Create color and size strings
      const colorList = product.colors.join(", ");
      const sizeList = product.sizes.join(", ");

      item.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <div class="info">
          <div class="row">
            <h4>${product.title.substring(0, 20)}...</h4>
            <span>$${product.price}</span>
          </div>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Colors:</strong> ${colorList}</p>
          <p><strong>Sizes:</strong> ${sizeList}</p>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `;

      // Add to Cart button functionality
      const addToCartBtn = item.querySelector(".add-to-cart");
      addToCartBtn.addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((p) => p.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Item added to cart!");
      });

      productListContainer.appendChild(item);
    });

    setupFilters(); // Filtering still works
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
    productListContainer.innerHTML = "<p style='color: red;'>Failed to load products.</p>";
  });



  function setupFilters() {
    // Category filter
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        selectedCategories = Array.from(categoryCheckboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.id.toLowerCase());
        applyFilters();
      });
    });

    // Price range filter
    priceRangeInput.addEventListener("input", () => {
      selectedPrice = parseInt(priceRangeInput.value);
      applyFilters();
    });

    // Sort filter
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        priceSort = btn.innerText.toLowerCase().includes("low")
          ? "low"
          : btn.innerText.toLowerCase().includes("high")
          ? "high"
          : "all";
        applyFilters();
      });
    });

    //Add event listeners for color and size filters

    const colorCheckboxes = document.querySelectorAll(".color-filter");
    colorCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        selectedColors = Array.from(colorCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value.toLowerCase());
        applyFilters();
      });
    });


    const sizeCheckboxes = document.querySelectorAll(".size-filter");
    sizeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        selectedSizes = Array.from(sizeCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value.toLowerCase());
        applyFilters();
      }); 
    });

  }

  function applyFilters() {
    const items = Array.from(document.querySelectorAll(".item"));
  
    items.forEach((item) => {
      const category = item.getAttribute("data-category");
      const price = parseFloat(item.getAttribute("data-price"));
      const colors = item.getAttribute("data-colors")?.split(",") || [];
      const sizes = item.getAttribute("data-sizes")?.split(",") || [];
  
      let show = true;
  
      if (selectedCategories.length && !selectedCategories.includes(category)) {
        show = false;
      }
  
      if (price > selectedPrice) {
        show = false;
      }
  
      if (selectedColors.length && !selectedColors.some((c) => colors.includes(c))) {
        show = false;
      }
  
      if (selectedSizes.length && !selectedSizes.some((s) => sizes.includes(s))) {
        show = false;
      }
  
      item.style.display = show ? "flex" : "none";
    });
  
    if (priceSort !== "all") {
      const parent = document.getElementById("product-list");
      const visibleItems = items.filter((item) => item.style.display !== "none");
  
      const sorted = visibleItems.sort((a, b) => {
        const aPrice = parseFloat(a.getAttribute("data-price"));
        const bPrice = parseFloat(b.getAttribute("data-price"));
        return priceSort === "low" ? aPrice - bPrice : bPrice - aPrice;
      });
  
      sorted.forEach((item) => parent.appendChild(item));
    }
  }
});  
