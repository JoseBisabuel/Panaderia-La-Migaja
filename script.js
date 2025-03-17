document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Carga el carrito desde localStorage
    const cartContainer = document.querySelector('.cart-items'); // Contenedor del carrito
    const totalElement = document.getElementById('total'); // Elemento donde se muestra el total
    const checkoutButton = document.getElementById('checkout'); // Botón de WhatsApp

    // Verifica si los elementos del carrito existen en la página
    if (cartContainer && totalElement && checkoutButton) {
        // Función para actualizar el carrito
        function updateCart() {
            cartContainer.innerHTML = ''; // Esto limpia el contenido del carrito
            let total = 0;

            // Recorre los productos en el carrito y los muestra
            cartItems.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');

                // Contenido del producto en el carrito
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

            // Mostrar el total debajo de los productos
            totalElement.textContent = total.toLocaleString();

            // Guardar el carrito en localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Agrega eventos a los botones de eliminar
            addRemoveItemEvents();
        }

        // Función para añadir eventos a los botones de eliminar
        function addRemoveItemEvents() {
            document.querySelectorAll('.remove-item').forEach((button) => {
                button.addEventListener('click', function () {
                    const index = this.getAttribute('data-index'); // Índice del producto a eliminar
                    cartItems.splice(index, 1); // Elimina el producto del carrito
                    updateCart(); // Actualiza la vista del carrito
                });
            });
        }

        // Añadir productos al carrito
        document.querySelectorAll('.add-to-cart').forEach((button) => {
            button.addEventListener('click', function () {
                const name = this.getAttribute('data-name'); // Nombre del producto
                const price = parseInt(this.getAttribute('data-price')); // Precio del producto

                // Añade el producto al carrito
                cartItems.push({ name, price });
                updateCart(); // Actualiza la vista del carrito 
            });
        });

        // Continuar pedido por WhatsApp
        checkoutButton.addEventListener('click', function () {
            if (cartItems.length === 0) {
                alert('Tu carrito está vacío. Añade productos antes de continuar.');
                return;
            }

            // Crear el mensaje para WhatsApp
            const message = cartItems
                .map((item) => `${item.name} - $${item.price.toLocaleString()}`)
                .join('%0A'); // Separar cada producto con un salto de línea
            const total = cartItems.reduce((sum, item) => sum + item.price, 0); // Calcular el total
            const whatsappUrl = `https://wa.me/3118136934?text=Hola, quiero hacer un pedido:%0A${message}%0ATotal: $${total.toLocaleString()}`;

            // Abrir WhatsApp en una nueva pestaña
            window.open(whatsappUrl, '_blank');
        });

        // Cargar el carrito al iniciar la página
        updateCart();
    } else {
        console.log('El carrito no está presente en esta página.');
    }
});