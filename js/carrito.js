// ========== CARRITO COMPLETO ==========
console.log("🛒 Script del carrito cargado");

// Variables globales
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartContainer = document.querySelector('.cart-items');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkout');

// ===== FUNCIONES DEL CARRITO =====
function updateCart() {
  if (!cartContainer || !totalElement) return;
  
  cartContainer.innerHTML = '';
  let total = 0;

  cartItems.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-price">$${item.price.toLocaleString()}</span>
      </div>
      <button class="remove-item" data-index="${index}">Eliminar</button>
    `;
    cartContainer.appendChild(cartItem);
    total += item.price;
  });

  totalElement.textContent = total.toLocaleString();
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  setupRemoveButtons();
}

function setupRemoveButtons() {
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      cartItems.splice(index, 1);
      updateCart();
    });
  });
}

// ===== WHATSAPP =====
function sendWhatsAppOrder() {
  if (cartItems.length === 0) {
    alert('🛒 Tu carrito está vacío');
    return;
  }

  const message = cartItems
    .map(item => `${item.name} - $${item.price.toLocaleString()}`)
    .join('%0A');
  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const whatsappUrl = `https://wa.me/3118136934?text=Hola, quiero hacer un pedido:%0A${message}%0ATotal: $${total.toLocaleString()}`;

  window.open(whatsappUrl, '_blank');
}

// ===== EVENTOS =====
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    const name = this.getAttribute('data-name');
    const price = parseInt(this.getAttribute('data-price'));
    cartItems.push({ name, price });
    updateCart();
    
    // Notificación
    this.classList.add('show-notification');
    setTimeout(() => this.classList.remove('show-notification'), 600);
  });
});

if (checkoutButton) {
  checkoutButton.addEventListener('click', sendWhatsAppOrder);
}

// Inicialización
updateCart();