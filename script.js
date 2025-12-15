document.addEventListener('DOMContentLoaded', () => {
    // --- I. Theme Switcher (Light/Dark Mode) ---
    const body = document.body;
    const lightModeToggle = document.getElementById('lightModeToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');

    const setMode = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            lightModeToggle.classList.remove('active');
            darkModeToggle.classList.add('active');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            lightModeToggle.classList.add('active');
            darkModeToggle.classList.remove('active');
            localStorage.setItem('theme', 'light');
        }
    };

    // Load saved theme, default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setMode(savedTheme === 'dark');

    lightModeToggle.addEventListener('click', () => setMode(false));
    darkModeToggle.addEventListener('click', () => setMode(true));


    // --- II. Shopping Cart Logic ---
    let cart = []; // The main cart array
    const cartCountElement = document.getElementById('cart-count');
    const cartListElement = document.getElementById('cart-items-list');
    const cartTotalElement = document.getElementById('cart-total-amount');

    // Function to render the cart in the HTML
    const renderCart = () => {
        cartListElement.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartListElement.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <div class="item-details">
                        <h5>${item.name}</h5>
                        <span style="margin-left: 10px;">($${item.price.toFixed(2)})</span>
                    </div>
                    <div class="item-quantity">
                        <span style="font-weight: 600;">Qty: ${item.quantity}</span>
                        <button class="item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Remove</button>
                    </div>
                `;
                cartListElement.appendChild(cartItemDiv);
            });
        }

        cartTotalElement.textContent = total.toFixed(2);
        cartCountElement.textContent = cart.length; // Simple count of different items
    };

    // Add to Cart Handler
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productId = card.dataset.id;
            const productName = card.dataset.name;
            const productPrice = parseFloat(card.dataset.price);

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }

            // Simple visual feedback
            button.textContent = 'Added!';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
            }, 800);

            renderCart();
            // Optional: Scroll to cart to show success
            document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Remove from Cart Handler (Delegation)
    cartListElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('item-remove') || e.target.closest('.item-remove')) {
            const button = e.target.closest('.item-remove');
            const productId = button.dataset.id;

            // Find the index of the item to remove
            const itemIndex = cart.findIndex(item => item.id === productId);

            if (itemIndex > -1) {
                // Completely remove the item from the cart
                cart.splice(itemIndex, 1);
                renderCart();
            }
        }
    });

    // --- III. Checkout Form Submission ---
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty. Please add a product before checking out.');
            return;
        }

        // Gather form data (in a real scenario, this would be encrypted and sent to a server)
        const formData = {
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            ccNumber: document.getElementById('cc-number').value,
            ccExpiry: document.getElementById('cc-expiry').value,
            ccCVV: document.getElementById('cc-cvv').value,
            cart: cart,
            total: document.getElementById('cart-total-amount').textContent,
            payment_target: '$syxfer'
        };

        // --- Simulated Success/Server Processing ---
        console.log('--- Checkout Submitted ---');
        console.log('Order Details:', formData);

        // Clear cart after successful 'purchase'
        cart = [];
        renderCart();

        // Clear form fields
        checkoutForm.reset();

        // Show success message
        alert(`Thank you for your order! Your payment of $${formData.total} has been simulated for CashApp: ${formData.payment_target}. Your cart has been cleared.`);
        
        // Scroll back to home/top
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    });

    // Initial render
    renderCart();
});
