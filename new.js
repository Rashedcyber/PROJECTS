let products = [];
let filteredProducts = [];


const fetchProducts = async () => {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/6748a356e41b4d34e45c5e20', {
            // headers: {
            //     "X-Master-Key": "$2a$10$ikKkL1qXtiSmDaU./ghLtebK77pQ1dIbCtxN2cdASi41ugkligoT6", // Replace with your API key if needed
            //     "Content-Type": "application/json"
            // }
        });
        const data = await response.json();
        products = data.record;
        filteredProducts = products;
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};


function searchProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.cat.toLowerCase().includes(query) ||
        product.wt.toLowerCase().includes(query)
    );

    displayProducts(filteredProducts);
}


function sortProducts(criteria) {
    if (criteria === 'low') {

        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (criteria === 'high') {

        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (criteria === 'name') {

        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else {

        filteredProducts = [...products];
    }

    displayProducts(filteredProducts);
}
function toggleCartControls(button) {

    button.style.display = "none";
    const counterControls = button.parentNode.querySelector('.counter-controls');
    counterControls.style.display = "flex";


    const itemCount = counterControls.querySelector('.item-count');
    itemCount.textContent = 1;
}

function updateCartCount(button, action) {
    const counterControls = button.parentNode;
    const itemCountElement = counterControls.querySelector('.item-count');
    let currentCount = parseInt(itemCountElement.textContent); t

    if (action === 'increment') {
        currentCount++;
    } else if (action === 'decrement') {
        currentCount--;
    }

    itemCountElement.textContent = currentCount;


    if (currentCount === 0) {
        const addButton = counterControls.parentNode.querySelector('.add-to-cart-btn');
        addButton.style.display = "inline-block";
        counterControls.style.display = "none";
    }
}

function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
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


document.getElementById('sd-select').addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    sortProducts(selectedValue);
});


window.onload = fetchProducts;
