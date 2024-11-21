let products = []; // This will store the products fetched from the API
let filteredProducts = []; // This will store products matching the search criteria

// Fetch products from the API
const fetchProducts = async () => {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/673f7abcad19ca34f8cde722', {
            headers: {
                "X-Master-Key": "$2a$10$ikKkL1qXtiSmDaU./ghLtebK77pQ1dIbCtxN2cdASi41ugkligoT6", // Replace with your API key if needed
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        products = data.record; // Accessing the array of products
        filteredProducts = products; // Initially, all products are displayed
        displayProducts(filteredProducts); // Display all products
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Search products based on user input
function searchProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.cat.toLowerCase().includes(query) ||
        product.wt.toLowerCase().includes(query)
    );

    displayProducts(filteredProducts); // Display filtered products
}

// Sort products based on the selected criteria
function sortProducts(criteria) {
    if (criteria === 'low') {
        // Sort by price (Low to High)
        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (criteria === 'high') {
        // Sort by price (High to Low)
        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (criteria === 'name') {
        // Sort by name (A to Z)
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        // Default to original order if 'Relevance' is selected
        filteredProducts = [...products];
    }

    displayProducts(filteredProducts); // Refresh the displayed products
}
function toggleCartControls(button) {
    // Hide the "Add to Cart" button and show the quantity controls
    button.style.display = "none";
    const counterControls = button.parentNode.querySelector('.counter-controls');
    counterControls.style.display = "flex";  // Show the + and - buttons

    // Initialize count to 1 when the button is clicked
    const itemCount = counterControls.querySelector('.item-count');
    itemCount.textContent = 1;
}

function updateCartCount(button, action) {
    const counterControls = button.parentNode; // Get the parent container of the buttons
    const itemCountElement = counterControls.querySelector('.item-count'); // Find the counter span
    let currentCount = parseInt(itemCountElement.textContent); // Get the current count

    if (action === 'increment') {
        currentCount++; // Increment the count
    } else if (action === 'decrement') {
        currentCount--; // Decrement the count, but not below 1
    }

    itemCountElement.textContent = currentCount; // Update the displayed count

    // If the count is zero, show the "Add to Cart" button again
    if (currentCount === 0) {
        const addButton = counterControls.parentNode.querySelector('.add-to-cart-btn');
        addButton.style.display = "inline-block"; // Show the "Add to Cart" button again
        counterControls.style.display = "none"; // Hide the quantity controls
    }
}

// Display products as cards
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous content

    if (productsToDisplay.length === 0) {
        productList.innerHTML = '<p>No products found.</p>'; // Display a message if no products match
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="Product Image">
                <h3>${product.name}</h3>
                <p>Category: ${product.cat}</p>
                <p class="price"><strong>Price: ₹${product.price}</strong></p>
                <p>Weight: ${product.wt}</p>
                <div class="cart-controls">
    <button class="add-to-cart-btn" onclick="toggleCartControls(this)">Add to Cart</button>
    <div class="counter-controls" style="display: none;">
        <button class="counter-btn" onclick="updateCartCount(this, 'decrement')">-</button>
        <span class="item-count">0</span>
        <button class="counter-btn" onclick="updateCartCount(this, 'increment')">+</button>
    </div>
</div>

            </div>
        `;
        productList.innerHTML += productCard;
    });
}

// Listen for changes in the sort dropdown
document.getElementById('sd-select').addEventListener('change', (event) => {
    const selectedValue = event.target.value; // Get the selected sorting criteria
    sortProducts(selectedValue); // Sort products based on the selected criteria
});

// Initialize fetching products on load
window.onload = fetchProducts;
