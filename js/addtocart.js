// Get the button click event for adding to cart
const addToCartBtns = document.querySelectorAll('.add-to-cart');


function showNotification(){
  
  const noti = document.getElementById('cart-notification');
  noti.classList.remove('hidden');
  noti.classList.add('visible');

  setTimeout(() => {
    noti.classList.remove('visible');
    noti.classList.add('hidden');
  }, 3000);
}


addToCartBtns.forEach((btn) => {
  btn.addEventListener('click', function () {
    const product = {
      id: this.getAttribute('data-id'),
      name: this.getAttribute('data-name'),
      price: parseFloat(this.getAttribute('data-prices')),
      image: this.getAttribute('data-image'),
      quantity: document.querySelector('input[type="number"]').value || 1
    };

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already exists in the cart
    const productIndex = cart.findIndex(item => item.id === product.id);
    if (productIndex !== -1) {
      // If product exists, update the quantity
      cart[productIndex].quantity = parseInt(cart[productIndex].quantity) + parseInt(product.quantity);
      showNotification();
    } else {
      // If product doesn't exist, add it to the cart
      cart.push(product);
      showNotification();
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    
  });
});


// Fetch cart data from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Select the table body where cart items will be displayed
const cartTableBody = document.querySelector('table tbody');

const subtotalElement = document.querySelector('#subtotal table');

// If the cart is empty, show a message
if (cart.length === 0) {
    cartTableBody.innerHTML = '<tr class="empty-cart-message"><td colspan="6">Your cart is empty!</td></tr>';
} else {
    // Loop through the cart items and add them to the table
    cart.forEach(item => {
        const row = document.createElement('tr');
        // Create each column for the product in the cart
        row.innerHTML = `
          
            <td><a href="#" class="remove-item" data-id="${item.id}"><i class="fa-solid fa-circle-xmark"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td><input type="number" value="${item.quantity}" data-id="${item.id}" class="quantity"></td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          
        `;
        
        // Append the row to the table body
        cartTableBody.appendChild(row);
    });
}

// Add event listener for removing items
const removeBtns = document.querySelectorAll('.remove-item');
removeBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-id');

        // Remove the item from the cart
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Reload the page to reflect the updated cart
        location.reload();
    });
});

// Update subtotal, total, and shipping
const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
const shipping = 0; // Example shipping cost
const total = subtotal + shipping;

// Display the updated values
document.querySelector('#subtotal table').innerHTML = `
    <tr>
        <td>Cart Subtotal</td>
        <td>$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
        <td>Shipping</td>
        <td>Free</td>
    </tr>
    <tr>
        <td><strong>Total</strong></td>
        <td><strong>$${total.toFixed(2)}</strong></td>
    </tr>
`;