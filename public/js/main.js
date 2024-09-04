//-------------------------------------------------------------------------
// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function(event) {
  event.preventDefault();
  
  const input = document.querySelector('#yourname'),
        json = { yourname: input.value },
        body = JSON.stringify(json);

  const response = await fetch('/submit', {
    method: 'POST',
    body 
  });

  const text = await response.text();

  console.log('text:', text);
}

document.addEventListener("DOMContentLoaded", function() {
  let cart = {};

  const addToCartForms = document.querySelectorAll(".add-to-cart-form");

  addToCartForms.forEach(form => {
    form.addEventListener("submit", function(event) {
      event.preventDefault();

      const productName = form.querySelector("input[name='product-name']").value;
      const productPrice = parseFloat(form.querySelector("input[name='product-price']").value);
      const quantity = parseInt(form.querySelector("input[name='quantity']").value);

      if (cart[productName]) {
        cart[productName].quantity += quantity;
      } else {
        cart[productName] = {
          price: productPrice,
          quantity: quantity
        };
      }

      updateCart();
    });
  });

  function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (cartItems && cartTotal) {
      cartItems.innerHTML = "";
      let total = 0;

      for (const [name, item] of Object.entries(cart)) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const listItem = document.createElement("li");
        listItem.textContent = `${name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}`;
        cartItems.appendChild(listItem);
      }

      cartTotal.textContent = `Total: $${total.toFixed(2)}`;

      window.cartTotal = total;
    }
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;
      const instructions = document.getElementById('instructions').value;

      document.getElementById('confirm-name').value = name;
      document.getElementById('confirm-phone').value = phone;
      document.getElementById('confirm-address').value = address;
      document.getElementById('confirm-instructions').value = instructions;

      const basePrice = window.cartTotal || 0;
      const deliveryFee = 5.00;
      const taxRate = 0.07;
      const totalPrice = (basePrice * (1 + taxRate)) + deliveryFee;
      const taxPrice = (basePrice * (1 + taxRate)) - basePrice;

      const confirmBasePrice = document.getElementById('confirm-food');
      if (confirmBasePrice) {
        confirmBasePrice.textContent = `$${basePrice.toFixed(2)}`;
      }

      const confirmPrice = document.getElementById('confirm-price');
      if (confirmPrice) {
        confirmPrice.textContent = `$${totalPrice.toFixed(2)}`;
      }

      const confirmTax = document.getElementById('confirm-tax');
      if (confirmTax) {
        confirmTax.textContent = `$${taxPrice.toFixed(2)}`;
      }

      document.querySelector('.contact-form').style.display = 'none';
      document.querySelector('.confirm-form').style.display = 'block';
    });
  }

  const confirmForm = document.getElementById('confirmForm');
  if (confirmForm) {
    confirmForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const confirmedData = {
        name: document.getElementById('confirm-name').value,
        phone: document.getElementById('confirm-phone').value,
        address: document.getElementById('confirm-address').value,
        instructions: document.getElementById('confirm-instructions').value,
        taxPrice: document.getElementById('confirm-tax').textContent,
        totalPrice: document.getElementById('confirm-price').textContent,
      };

      cart = {};
      updateCart();

      document.querySelector('.confirm-form').style.display = 'none';
      document.querySelector('.contact-form').style.display = 'block';

      console.log('Order Confirmed:', confirmedData);

      alert('Your order has been placed successfully!');

    this.reset();

    });
  }
});
