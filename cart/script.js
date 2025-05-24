let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const grid = document.getElementById("cart-grid");
  const list = document.getElementById("checkout-list");
  const totalEl = document.getElementById("total-price");

  grid.innerHTML = "";
  list.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    // Left Grid
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="Product" />
      <p>Title : ${item.title}</p>
      <p>Price : $${item.price}</p>
      <button onclick="removeFromCart(${item.id})">Remove From Cart</button>
    `;
    grid.appendChild(div);

    // Right List
    const li = document.createElement("li");
    li.textContent = `${item.title} $${item.price}`;
    list.appendChild(li);

    total += item.price;
  });

  totalEl.textContent = `Rs ${total}/-`;
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty!");

  const options = {
    key: "rzp_test_mH8C4dstS1fKf5",
    amount: cart.reduce((sum, item) => sum + item.price, 0) * 100,
    currency: "INR",
    name: "Shopping Cart",
    description: "Purchase",
    handler: function (response) {
      alert("Payment Successful! ID: " + response.razorpay_payment_id);
      cart = [];
      localStorage.removeItem("cart");
      renderCart();
    },
    theme: {
      color: "#3399cc"
    }
  };
  const rzp = new Razorpay(options);
  rzp.open();
});

renderCart();
