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

    
    let cart = JSON.parse(localStorage.getItem('cart')) || []; //to get the cart from local storage and if doesn't exist set it to empty list.

    const productIndex = cart.findIndex(item => item.id === product.id);
    if (productIndex !== -1) {
      cart[productIndex].quantity = parseInt(cart[productIndex].quantity) + parseInt(product.quantity); //if products exists then increase the quantity.
      showNotification();
    } else {
      cart.push(product); // If product doesn't exist, add it to the cart
      showNotification();
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    
  });
});


const cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartTableBody = document.querySelector('table tbody');

const subtotalElement = document.querySelector('#subtotal table');

if (cart.length === 0) {
    cartTableBody.innerHTML = '<tr class="empty-cart-message"><td colspan="6">Your cart is empty!</td></tr>'; //If cart is empty display a message
} else {
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          
            <td><a href="#" class="remove-item" data-id="${item.id}"><i class="fa-solid fa-circle-xmark"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td><input type="number" value="${item.quantity}" data-id="${item.id}" class="quantity"></td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          
        `;
        
        cartTableBody.appendChild(row); //append row with the cartablebody. 
    });
}

const removeBtns = document.querySelectorAll('.remove-item');
removeBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-id'); //get the data-id of the button clicked and store it in variable productId

        const updatedCart = cart.filter(item => item.id !== productId); //creates a new array then only the products whose id doesn't match the productId(button clicked) is added to the new array rest are removed.
        localStorage.setItem('cart', JSON.stringify(updatedCart)); //creating updatedCart's Json file and storing it in the localStorage

        // Reload the page to reflect the updated cart
        location.reload();
    });
});


const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0); //calculates the total cost of all the items by summing the price and quantity for each item.
let shipping = 0;
if (subtotal == 0){
  shipping = 0;
}
else if (subtotal != 0 && subtotal < 99.99){
  shipping = 4.99;
}
else {
  shipping = 0;
}

const total = subtotal + shipping;

// Display the new values on page using innerHTML
document.querySelector('#subtotal table').innerHTML = `
    <tr>
        <td>Cart Subtotal</td>
        <td>$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
        <td>Shipping</td>
        <td>$${shipping.toFixed(2)}</td>
    </tr>
    <tr>
        <td><strong>Total</strong></td>
        <td><strong>$${total.toFixed(2)}</strong></td>
    </tr>
`;