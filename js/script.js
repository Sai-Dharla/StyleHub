/* ============================================================
   StyleHub — Main JavaScript
   ------------------------------------------------------------
   Currently implements:
     1. Mobile navigation (hamburger open/close)
     2. Header shadow while scrolling
     3. Footer copyright year
     4. Featured Products, collections, cart page: rendering, wishlist, add-to-bag
     5. Account page: simulated login, register, logout

   Planned for later phases:
     - Product listing filters & product detail page
     - localStorage persistence
     - Newsletter form validation (#newsletter-form)
     - Search, checkout, account
   ============================================================ */

"use strict";

/* =========================================================
   7. FEATURED PRODUCTS
   ========================================================= */

/* 7.1 Product data
   ---------------------------------------------------------
   Single source of truth for the Featured Products grid.
   Cards are rendered dynamically — never hardcoded in HTML. */
const products = [
    {
        id: 1,
        name: "Luna Satin Dress",
        price: 2499,
        originalPrice: 3299,
        category: "women",
        brand: "StyleHub",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Blush Pink"],
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Woman wearing an elegant flowing satin dress",
        description: "Cut from a smooth satin finish, this elegant silhouette brings effortless polish to evening occasions and special moments.",
        rating: 4.8,
        reviews: 124,
        badge: "NEW"
    },
    {
        id: 2,
        name: "Aria Oversized Blouse",
        price: 1799,
        originalPrice: 2299,
        category: "women",
        brand: "StyleHub",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Sand"],
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Crisp white oversized blouse on a hanger",
        description: "A relaxed, drapey blouse with a soft-touch finish — an easy layer that elevates everything from denim to tailored trousers.",
        rating: 4.6,
        reviews: 86,
        badge: "SALE"
    },
    {
        id: 3,
        name: "Éclat Wide-Leg Trousers",
        price: 2199,
        category: "women",
        brand: "StyleHub",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Ivory", "Navy"],
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Woman styled in elegant wide-leg trousers",
        description: "Flowing wide-leg trousers with a high, clean waistband for an elongating line that moves beautifully all day.",
        rating: 4.7,
        reviews: 61
    },
    {
        id: 4,
        name: "Heritage Oxford Shirt",
        price: 1899,
        originalPrice: 2499,
        category: "men",
        brand: "StyleHub",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Sky Blue"],
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Man wearing a classic white oxford shirt",
        description: "Woven from breathable cotton oxford, this timeless shirt is softly structured for effortless, everyday refinement.",
        rating: 4.9,
        reviews: 203,
        badge: "BESTSELLER"
    },
    {
        id: 5,
        name: "Meridian Slim-Fit Trousers",
        price: 2399,
        category: "men",
        brand: "StyleHub",
        sizes: ["30", "32", "34", "36"],
        colors: ["Charcoal", "Stone"],
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Man wearing tailored slim-fit trousers",
        description: "Tailored in a refined stretch blend, these slim-fit trousers hold their shape from morning meetings to late dinners.",
        rating: 4.5,
        reviews: 74
    },
    {
        id: 6,
        name: "Ridge Denim Jacket",
        price: 3499,
        originalPrice: 4299,
        category: "men",
        brand: "StyleHub",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Mid Blue", "Black"],
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Classic blue denim jacket",
        description: "A hard-wearing denim jacket with a classic wash and considered detailing — the layer you will reach for every season.",
        rating: 4.8,
        reviews: 158,
        badge: "SALE"
    },
    {
        id: 7,
        name: "Junior Casual Hoodie Set",
        price: 1499,
        originalPrice: 1999,
        category: "kids",
        brand: "StyleHub",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
        colors: ["Oat", "Sage"],
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Soft casual hoodie in a neutral tone",
        description: "Brushed for softness, this cosy two-piece set keeps little ones comfortable through play, rest and everything in between.",
        rating: 4.7,
        reviews: 93,
        badge: "NEW"
    },
    {
        id: 8,
        name: "Mini Bloom Summer Dress",
        price: 1299,
        category: "kids",
        brand: "StyleHub",
        sizes: ["2-3Y", "4-5Y", "6-7Y"],
        colors: ["Coral", "White"],
        image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=700&q=80",
        imageAlt: "Young girl dressed in a light summer outfit",
        description: "Light, breathable and easy to move in, this cheerful summer dress is made for sunny adventures and twirls.",
        rating: 4.6
    }
];

/* 7.2 Price + discount helpers */
const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

/** Formats a number as Indian Rupees, e.g. 2499 -> "₹2,499". */
function formatPrice(amount) {
    return inrFormatter.format(amount);
}

/** Returns the discount % between price and originalPrice (0 if N/A). */
function calculateDiscountPercent(price, originalPrice) {
    if (!originalPrice || originalPrice <= price) {
        return 0;
    }
    return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/* 7.3 Product rendering */
const STAR_SVG = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.6l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.42l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.6z"/></svg>';

const HEART_ICON = '<svg class="product-card__heart" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

/** Builds an accessible 5-star rating (gold fill clipped to the rating). */
function buildStarRating(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const percent = (safeRating / 5) * 100;

    return `
        <span class="product-card__stars" role="img" aria-label="Rated ${safeRating} out of 5 stars">
            <span class="product-card__stars-bg" aria-hidden="true">${STAR_SVG.repeat(5)}</span>
            <span class="product-card__stars-fill" style="width: ${percent}%" aria-hidden="true">${STAR_SVG.repeat(5)}</span>
        </span>`;
}

/** Builds one product card element. Optional fields are handled safely. */
function createProductCard(product) {
    const discount = calculateDiscountPercent(product.price, product.originalPrice);

    // Optional pieces stay empty (never "undefined") when data is missing.
    const badgeHTML = product.badge
        ? `<span class="product-card__badge product-card__badge--${String(product.badge).toLowerCase()}">${product.badge}</span>`
        : "";
    const originalPriceHTML = product.originalPrice
        ? `<span class="product-card__price-original">${formatPrice(product.originalPrice)}</span>`
        : "";
    const discountHTML = discount > 0
        ? `<span class="product-card__discount">${discount}% OFF</span>`
        : "";
    const reviewsHTML = product.reviews
        ? `<span class="product-card__reviews">(${product.reviews})</span>`
        : "";
    const altText = product.imageAlt || `${product.name} by ${product.brand}`;

    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
        <div class="product-card__media">
            <a class="product-card__detail" href="#product-${product.id}" data-product-id="${product.id}"
               aria-label="View details for ${product.name}">
                <img class="product-card__image" src="${product.image}" alt="${altText}" loading="lazy" decoding="async" />
            </a>
            ${badgeHTML}
            <button type="button" class="product-card__wishlist"
                    data-wishlist-id="${product.id}" aria-pressed="false"
                    aria-label="Add ${product.name} to wishlist">${HEART_ICON}</button>
        </div>
        <div class="product-card__body">
            <p class="product-card__brand">${product.brand}</p>
            <h3 class="product-card__name">
                <a class="product-card__name-link" href="#product-${product.id}" data-product-id="${product.id}">${product.name}</a>
            </h3>
            <p class="product-card__rating">
                ${buildStarRating(product.rating)}
                <span class="product-card__rating-value">${Number(product.rating).toFixed(1)}</span>
                ${reviewsHTML}
            </p>
            <p class="product-card__pricing">
                <span class="product-card__price">${formatPrice(product.price)}</span>
                ${originalPriceHTML}
                ${discountHTML}
            </p>
            <button type="button" class="product-card__add" data-add-id="${product.id}">Add to Bag</button>
        </div>`;

    return card;
}

/**
 * Renders an array of products into a container element.
 * 1. clears the container, 2. loops the array, 3. builds each card,
 * 4. inserts everything into the DOM.
 */
function renderProducts(productArray, container) {
    if (!container) {
        return;
    }

    container.innerHTML = "";                                // 1. clear
    const fragment = document.createDocumentFragment();

    productArray.forEach((product) => {                      // 2. loop
        fragment.appendChild(createProductCard(product));    // 3. build
    });

    container.appendChild(fragment);                         // 4. insert
}

/* 7.4 Collection rendering
   ---------------------------------------------------------
   Filters the shared `products` array by category and renders
   the result with the existing renderProducts() helper — no
   duplicate product data or card code. */
function renderCollection(category, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    const categoryProducts = products.filter((product) => product.category === category);
    renderProducts(categoryProducts, container);

    // Dynamic category count, e.g. "3 styles" (updates automatically)
    const countElement = document.querySelector(`[data-collection-count="${category}"]`);

    if (countElement) {
        countElement.textContent =
            `${categoryProducts.length} style${categoryProducts.length === 1 ? "" : "s"}`;
    }
}

/* 7.5 Wishlist + shopping bag state (localStorage comes later) */
let wishlist = [];
let cart = [];
let orders = [];

/** Adds/removes a product id from the wishlist and updates the heart button. */
function toggleWishlist(productId, button) {
    const index = wishlist.indexOf(productId);
    const product = products.find((item) => item.id === productId);

    if (index === -1) {
        wishlist.push(productId);
    } else {
        wishlist.splice(index, 1);
    }

    const isActive = wishlist.includes(productId);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    if (product) {
        button.setAttribute("aria-label",
            `${isActive ? "Remove" : "Add"} ${product.name} ${isActive ? "from" : "to"} wishlist`);
    }

    showToast(isActive ? "Added to your wishlist" : "Removed from your wishlist");

    // Keep the account wishlist grid in sync while logged in
    if (currentUser) {
        renderAccountWishlist();
    }

    saveState();
}

/** Adds an item to the bag.
    Cart items keep their variant: { id, size, color, quantity }.
    - Same product + same size + same color -> quantity increases
    - Same product + different size/color   -> separate cart item */
function addToCart(productId, options = {}) {
    const size = options.size || null;
    const color = options.color || null;
    const quantity = Math.max(1, Number(options.quantity) || 1);

    const existing = cart.find((item) =>
        item.id === productId && item.size === size && item.color === color);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, size: size, color: color, quantity: quantity });
    }

    updateCartCount();
    saveState();
    showToast("Added to your bag");
}

/** Keeps the header cart badge (#cart-count) showing the total
    item quantity, e.g. one product x2 + another x1 -> "3". */
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = String(totalQuantity);
        cartCount.hidden = false;
    }
}

let toastTimer = null;

/** Shows a small non-blocking confirmation message at the bottom. */
function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");   // announced by screen readers
        document.body.appendChild(toast);
    }

    toast.textContent = message;

    requestAnimationFrame(() => toast.classList.add("is-visible"));

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

/* =========================================================
   8. SHOP — SEARCH, FILTERS & SORTING
   ========================================================= */

/* 8.1 Shop state (single source of truth for the discovery UI) */
const shopState = {
    search: "",
    category: "all",
    size: "all",
    color: "all",
    brand: "all",
    maxPrice: null,     // null = no limit; initialised from product data
    sort: "featured"
};

/* 8.2 Dynamic filter options (derived from the products array) */

/** Unique, sorted values for a product key (works for arrays & strings). */
function getUniqueValues(productArray, key) {
    const values = productArray
        .map((product) => product[key])
        .flat()
        .filter(Boolean);

    return [...new Set(values)].sort();
}

/** Highest product price — used as the price slider maximum. */
function getMaxPrice(productArray) {
    return productArray.reduce((max, product) => Math.max(max, product.price), 0);
}

/* 8.3 Filtering
   ---------------------------------------------------------
   filterProducts() always returns a NEW array — the original
   `products` array is never mutated. All active filters use
   logical AND behaviour. */
function filterProducts() {
    const searchTerm = shopState.search.trim().toLowerCase();

    const filtered = products.filter((product) => {
        // Search matches name, brand or category (case-insensitive)
        const matchesSearch = !searchTerm
            || product.name.toLowerCase().includes(searchTerm)
            || product.brand.toLowerCase().includes(searchTerm)
            || product.category.toLowerCase().includes(searchTerm);

        const matchesCategory = shopState.category === "all"
            || product.category === shopState.category;

        const matchesSize = shopState.size === "all"
            || (Array.isArray(product.sizes) && product.sizes.includes(shopState.size));

        const matchesColor = shopState.color === "all"
            || (Array.isArray(product.colors) && product.colors.includes(shopState.color));

        const matchesBrand = shopState.brand === "all"
            || product.brand === shopState.brand;

        const matchesPrice = shopState.maxPrice === null
            || product.price <= shopState.maxPrice;

        return matchesSearch && matchesCategory && matchesSize
            && matchesColor && matchesBrand && matchesPrice;
    });

    return sortProducts(filtered);
}

/* 8.4 Sorting (works on a COPY — never mutates the original array) */
function sortProducts(productArray) {
    const sorted = [...productArray];

    switch (shopState.sort) {
        case "price-asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "rating":
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case "name":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;   // "featured" keeps the original order
    }
}

/* 8.5 Shop rendering: results grid, result count, empty state */
function renderShop() {
    const grid = document.getElementById("shop-product-grid");
    const countElement = document.getElementById("shop-result-count");
    const emptyState = document.getElementById("shop-empty");

    if (!grid) {
        return;
    }

    const results = filterProducts();
    renderProducts(results, grid);

    if (countElement) {
        countElement.textContent =
            `${results.length} style${results.length === 1 ? "" : "s"} found`;
    }

    if (emptyState) {
        emptyState.hidden = results.length !== 0;
    }
}

/* 8.6 Filter option generation + initial shop setup */
function initShopControls() {
    const priceRange = document.getElementById("shop-filter-price");
    const priceValue = document.getElementById("shop-price-value");

    // Sizes, colors and brands are derived from the product data
    getUniqueValues(products, "sizes").forEach((size) => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        document.getElementById("shop-filter-size").appendChild(option);
    });

    getUniqueValues(products, "colors").forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        document.getElementById("shop-filter-color").appendChild(option);
    });

    getUniqueValues(products, "brand").forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        document.getElementById("shop-filter-brand").appendChild(option);
    });

    // Price slider: the maximum comes from the data, never hardcoded
    const maxPrice = getMaxPrice(products);
    shopState.maxPrice = maxPrice;

    if (priceRange) {
        priceRange.max = String(maxPrice);
        priceRange.value = String(maxPrice);
    }

    if (priceValue) {
        priceValue.textContent = formatPrice(maxPrice);
    }
}

/* 8.7 Clear all filters and restore every product */
function clearShopFilters() {
    const maxPrice = getMaxPrice(products);

    shopState.search = "";
    shopState.category = "all";
    shopState.size = "all";
    shopState.color = "all";
    shopState.brand = "all";
    shopState.maxPrice = maxPrice;
    shopState.sort = "featured";

    const searchInput = document.getElementById("shop-search-input");
    if (searchInput) searchInput.value = "";

    ["category", "size", "color", "brand"].forEach((key) => {
        const select = document.getElementById(`shop-filter-${key}`);
        if (select) select.value = "all";
    });

    const sortSelect = document.getElementById("shop-sort");
    if (sortSelect) sortSelect.value = "featured";

    const priceRange = document.getElementById("shop-filter-price");
    if (priceRange) priceRange.value = String(maxPrice);

    const priceValue = document.getElementById("shop-price-value");
    if (priceValue) priceValue.textContent = formatPrice(maxPrice);

    renderShop();
}

/* =========================================================
   9. PRODUCT DETAIL EXPERIENCE
   ========================================================= */

/* 9.1 Detail state */
let currentDetailProduct = null;
let detailReturnSection = "shop";
let detailQuantity = 1;
let detailSelectedSize = null;
let detailSelectedColor = null;
let sizeGuideLastFocus = null;

const SHOPPING_SECTIONS = [
    "featured-products",
    "shop",
    "mens-collection",
    "womens-collection",
    "kids-collection"
];

const categorySectionIds = {
    men: "mens-collection",
    women: "womens-collection",
    kids: "kids-collection"
};

/* 9.2 Open / close the detail view */
function openProductDetail(productId, options = {}) {
    const product = products.find((item) => item.id === Number(productId));
    const detail = document.getElementById("product-detail");

    // Unknown id -> calmly return to the normal shop view
    if (!product) {
        closeProductDetail();
        return;
    }

    // Same product already open (e.g. hashchange fired again)
    if (!detail.hidden && currentDetailProduct === product.id) {
        return;
    }

    if (options.returnSection && options.returnSection !== "product-detail") {
        detailReturnSection = options.returnSection;
    }

    currentDetailProduct = product.id;
    renderProductDetail(product);
    renderRelatedProducts(product);

    // Swap the shopping discovery view for the detail view
    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = true;
    });

    // Also tuck away the dedicated pages (cart / checkout / account)
    ["cart", "checkout", "account"].forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = true;
    });
    detail.hidden = false;

    if (options.updateHash !== false) {
        window.location.hash = `product-${product.id}`;
    }

    window.scrollTo(0, 0);
}

function closeProductDetail() {
    const detail = document.getElementById("product-detail");

    if (!detail || detail.hidden) {
        return;
    }

    detail.hidden = true;
    currentDetailProduct = null;

    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = false;
    });

    // Return to the dedicated page the detail was opened from, if any
    if (detailReturnSection === "cart") {
        openCartPage();
    } else if (detailReturnSection === "checkout") {
        openCheckoutPage();
    } else if (detailReturnSection === "account") {
        openAccountPage();
    }

    // Remove the product hash without an extra scroll jump
    if (window.location.hash.startsWith("#product-")) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const returnSection = document.getElementById(detailReturnSection);
    if (returnSection) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        returnSection.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
}

/* 9.3 Detail rendering */
function renderProductDetail(product) {
    const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    const categoryLinkTarget = categorySectionIds[product.category] || "shop";

    // Breadcrumb: HOME / WOMEN / LUNA SATIN DRESS
    document.getElementById("detail-breadcrumb-category").innerHTML =
        `<a class="detail-breadcrumb__link" href="#${categoryLinkTarget}">${categoryLabel}</a>`;
    document.getElementById("detail-breadcrumb-product").textContent = product.name;

    // Media
    const image = document.getElementById("detail-image");
    image.src = product.image;
    image.alt = product.imageAlt || `${product.name} by ${product.brand}`;

    // Information
    document.getElementById("detail-brand").textContent = product.brand;
    document.getElementById("detail-name").textContent = product.name;

    const reviewsHTML = product.reviews
        ? `<span class="detail-info__reviews">(${product.reviews} reviews)</span>`
        : "";
    document.getElementById("detail-rating").innerHTML =
        `${buildStarRating(product.rating)}
        <span class="detail-info__rating-value">${Number(product.rating).toFixed(1)}</span>
        ${reviewsHTML}`;

    const discount = calculateDiscountPercent(product.price, product.originalPrice);
    document.getElementById("detail-price").textContent = formatPrice(product.price);

    const originalElement = document.getElementById("detail-price-original");
    originalElement.hidden = !product.originalPrice;
    if (product.originalPrice) {
        originalElement.textContent = formatPrice(product.originalPrice);
    }

    const discountElement = document.getElementById("detail-discount");
    discountElement.hidden = discount === 0;
    if (discount > 0) {
        discountElement.textContent = `${discount}% OFF`;
    }

    document.getElementById("detail-description").textContent = product.description || "";

    // Selectors + quantity start fresh for every product
    detailSelectedSize = null;
    detailSelectedColor = null;
    detailQuantity = 1;
    renderDetailOptions(product);
    updateProductQuantity(1);

    document.getElementById("detail-size-value").textContent = "";
    document.getElementById("detail-color-value").textContent = "";
    document.getElementById("detail-size-error").hidden = true;

    updateDetailWishlist(product);
}

/* 9.4 Size & colour selectors (rendered from product data) */
function renderDetailOptions(product) {
    const sizesWrap = document.getElementById("detail-sizes");
    const colorsWrap = document.getElementById("detail-colors");

    sizesWrap.innerHTML = "";
    colorsWrap.innerHTML = "";

    (product.sizes || []).forEach((size) => {
        const choice = document.createElement("button");
        choice.type = "button";
        choice.className = "detail-choice";
        choice.textContent = size;
        choice.dataset.size = size;
        choice.setAttribute("aria-pressed", "false");
        sizesWrap.appendChild(choice);
    });

    (product.colors || []).forEach((color) => {
        const choice = document.createElement("button");
        choice.type = "button";
        choice.className = "detail-choice";
        choice.textContent = color;
        choice.dataset.color = color;
        choice.setAttribute("aria-pressed", "false");
        colorsWrap.appendChild(choice);
    });
}

function selectProductSize(size) {
    detailSelectedSize = size;
    document.getElementById("detail-size-value").textContent = size;

    document.querySelectorAll("#detail-sizes .detail-choice").forEach((choice) => {
        const selected = choice.dataset.size === size;
        choice.classList.toggle("is-selected", selected);
        choice.setAttribute("aria-pressed", String(selected));
    });

    document.getElementById("detail-size-error").hidden = true;
}

function selectProductColor(color) {
    detailSelectedColor = color;
    document.getElementById("detail-color-value").textContent = color;

    document.querySelectorAll("#detail-colors .detail-choice").forEach((choice) => {
        const selected = choice.dataset.color === color;
        choice.classList.toggle("is-selected", selected);
        choice.setAttribute("aria-pressed", String(selected));
    });
}

/* 9.5 Quantity (minimum 1) */
function updateProductQuantity(quantity) {
    detailQuantity = Math.max(1, Number(quantity) || 1);
    document.getElementById("detail-qty-value").textContent = String(detailQuantity);
}

/* 9.6 Detail wishlist (reuses the existing wishlist state + toast) */
function updateDetailWishlist(product) {
    const button = document.getElementById("detail-wishlist");
    const isActive = wishlist.includes(product.id);

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.innerHTML =
        `${HEART_ICON}<span>${isActive ? "Wishlisted" : "Add to Wishlist"}</span>`;
}

/* 9.7 Related products (same category first, then fill from others) */
function renderRelatedProducts(product) {
    const grid = document.getElementById("related-product-grid");

    if (!grid) {
        return;
    }

    const sameCategory = products.filter((item) =>
        item.category === product.category && item.id !== product.id);
    const otherCategories = products.filter((item) => item.category !== product.category);
    const related = sameCategory.concat(otherCategories).slice(0, 4);

    renderProducts(related, grid);
}

/* 9.8 Size guide modal */
function openSizeGuide() {
    const modal = document.getElementById("size-guide");

    sizeGuideLastFocus = document.activeElement;
    modal.hidden = false;
    document.getElementById("size-guide-close").focus();
}

function closeSizeGuide() {
    const modal = document.getElementById("size-guide");

    if (modal.hidden) {
        return;
    }

    modal.hidden = true;

    if (sizeGuideLastFocus) {
        sizeGuideLastFocus.focus();
    }
}

/* 9.9 URL hash: #product-ID opens the detail view directly */
function handleProductHash() {
    const match = window.location.hash.match(/^#product-(\d+)$/);

    if (match) {
        const product = products.find((item) => item.id === Number(match[1]));

        if (product) {
            openProductDetail(product.id, { updateHash: false });
            return;
        }
    }

    // No / invalid product hash -> back to the normal shop view
    closeProductDetail();
    closeCartPage();
    closeCheckoutPage();
    closeAccountPage();

    // #cart / #checkout open their pages directly
    if (window.location.hash === "#cart") {
        openCartPage();
        return;
    }

    if (window.location.hash === "#checkout") {
        openCheckoutPage();
        return;
    }

    if (window.location.hash === "#account") {
        openAccountPage();
        return;
    }

    // If the hash points to a page section (e.g. #shop), make sure it
    // is scrolled into view now that the sections are visible again.
    if (window.location.hash.length > 1) {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    }
}

/* =========================================================
   10. SHOPPING CART PAGE
   ========================================================= */

/* 10.1 Cart page state (coupon lives here for now) */
let appliedCoupon = null;

const CART_COUPONS = {
    STYLE10: { type: "percent", value: 10 },
    WELCOME500: { type: "fixed", value: 500 },
    FASHION15: { type: "percent", value: 15 }
};

/* 10.2 Open / close the cart page */
function openCartPage() {
    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = true;
    });

    const detail = document.getElementById("product-detail");
    if (detail) detail.hidden = true;

    if (window.location.hash.startsWith("#product-")) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    renderCart();

    const cartSection = document.getElementById("cart");
    if (cartSection) cartSection.hidden = false;

    window.scrollTo(0, 0);
}

function closeCartPage() {
    const cartSection = document.getElementById("cart");

    if (!cartSection || cartSection.hidden) {
        return;
    }

    cartSection.hidden = true;

    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = false;
    });
}

/* 10.3 Render the cart items — updates without a page reload */
function renderCart() {
    const emptyState = document.getElementById("cart-empty");
    const layout = document.getElementById("cart-layout");
    const itemsWrap = document.getElementById("cart-items");

    if (!emptyState || !layout || !itemsWrap) {
        return;
    }

    const hasItems = cart.length > 0;
    emptyState.hidden = hasItems;
    layout.hidden = !hasItems;

    if (!hasItems) {
        appliedCoupon = null;

        const couponInput = document.getElementById("cart-coupon-input");
        const couponMessage = document.getElementById("cart-coupon-message");
        if (couponInput) couponInput.value = "";
        if (couponMessage) {
            couponMessage.textContent = "";
            couponMessage.classList.remove("is-success", "is-error");
        }
        return;
    }

    itemsWrap.innerHTML = "";

    cart.forEach((item, index) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) {
            return;
        }

        const variantParts = [];
        if (item.size) variantParts.push(`Size: ${item.size}`);
        if (item.color) variantParts.push(`Color: ${item.color}`);
        const variantText = variantParts.length > 0 ? variantParts.join(" &middot; ") : "One size";

        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <img class="cart-item__image" src="${product.image}" alt="${product.imageAlt || product.name}" loading="lazy" />
            <div class="cart-item__info">
                <p class="cart-item__brand">${product.brand}</p>
                <h3 class="cart-item__name">${product.name}</h3>
                <p class="cart-item__variant">${variantText}</p>
                <p class="cart-item__price">${formatPrice(product.price)}</p>
            </div>
            <div class="cart-item__controls">
                <div class="cart-item__quantity">
                    <button type="button" class="detail-quantity__btn" data-cart-decrease="${index}" aria-label="Decrease quantity of ${product.name}">&minus;</button>
                    <span class="detail-quantity__value" aria-live="polite">${item.quantity}</span>
                    <button type="button" class="detail-quantity__btn" data-cart-increase="${index}" aria-label="Increase quantity of ${product.name}">+</button>
                </div>
                <p class="cart-item__total">${formatPrice(product.price * item.quantity)}</p>
                <button type="button" class="cart-item__remove" data-cart-remove="${index}">Remove</button>
            </div>`;

        itemsWrap.appendChild(row);
    });

    renderCartSummary();
}

/* 10.4 Order summary: subtotal, shipping, coupon, final total */

/** Shared cart math (also used by the checkout page). */
function calculateCartTotals() {
    const subtotal = cart.reduce((total, item) => {
        const product = products.find((p) => p.id === item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    let discount = 0;
    if (appliedCoupon) {
        discount = appliedCoupon.type === "percent"
            ? Math.round((subtotal * appliedCoupon.value) / 100)
            : appliedCoupon.value;
        discount = Math.min(discount, subtotal);   // never exceeds the subtotal
    }

    const shipping = subtotal >= 999 ? 0 : 99;

    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

function renderCartSummary() {
    const totals = calculateCartTotals();

    const subtotalElement = document.getElementById("cart-subtotal");
    const shippingElement = document.getElementById("cart-shipping");
    const discountRow = document.getElementById("cart-discount-row");
    const totalElement = document.getElementById("cart-total");

    if (subtotalElement) subtotalElement.textContent = formatPrice(totals.subtotal);
    if (shippingElement) shippingElement.textContent = totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping);

    if (discountRow) {
        discountRow.hidden = !appliedCoupon;
        if (appliedCoupon) {
            document.getElementById("cart-discount-code").textContent = appliedCoupon.code;
            document.getElementById("cart-discount").textContent = "-" + formatPrice(totals.discount);
        }
    }

    if (totalElement) totalElement.textContent = formatPrice(totals.total);
}

/* 10.5 Quantity changes + removal (no page reload) */
function changeCartQuantity(index, delta) {
    const item = cart[index];

    if (!item) {
        return;
    }

    item.quantity = Math.max(1, item.quantity + delta);
    renderCart();
    updateCartCount();
    saveState();
}

function removeCartItem(index) {
    if (cart[index]) {
        cart.splice(index, 1);
    }

    renderCart();
    updateCartCount();
    saveState();
    showToast("Removed from your bag");
}

/* 10.6 Coupons (discount is capped at the subtotal) */
function applyCoupon(rawCode) {
    const messageElement = document.getElementById("cart-coupon-message");
    const normalized = (rawCode || "").trim().toUpperCase();
    const coupon = CART_COUPONS[normalized];

    if (!coupon) {
        appliedCoupon = null;

        if (messageElement) {
            messageElement.textContent = "Invalid coupon code. Try STYLE10, WELCOME500 or FASHION15.";
            messageElement.classList.remove("is-success");
            messageElement.classList.add("is-error");
        }

        renderCartSummary();
        return;
    }

    appliedCoupon = { code: normalized, type: coupon.type, value: coupon.value };

    if (messageElement) {
        messageElement.textContent = `Coupon ${normalized} applied.`;
        messageElement.classList.add("is-success");
        messageElement.classList.remove("is-error");
    }

    renderCart();
}

/* =========================================================
   11. CHECKOUT
   ========================================================= */

/* 11.1 Open / close the checkout page */
function openCheckoutPage() {
    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = true;
    });

    const detail = document.getElementById("product-detail");
    if (detail) detail.hidden = true;

    const cartPage = document.getElementById("cart");
    if (cartPage) cartPage.hidden = true;

    if (window.location.hash.startsWith("#product-")) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    renderCheckout();

    const checkoutSection = document.getElementById("checkout");
    if (checkoutSection) checkoutSection.hidden = false;

    window.scrollTo(0, 0);
}

function closeCheckoutPage() {
    const checkoutSection = document.getElementById("checkout");

    if (!checkoutSection || checkoutSection.hidden) {
        return;
    }

    checkoutSection.hidden = true;

    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = false;
    });
}

/* 11.2 Checkout rendering: summary items, totals, empty-bag guard */
function renderCheckout() {
    const formView = document.getElementById("checkout-form-view");
    const confirmation = document.getElementById("checkout-confirmation");
    const emptyState = document.getElementById("checkout-empty");
    const summaryItems = document.getElementById("checkout-summary-items");

    const hasItems = cart.length > 0;

    if (confirmation) confirmation.hidden = true;
    if (emptyState) emptyState.hidden = hasItems;
    if (formView) formView.hidden = !hasItems;

    if (!hasItems || !summaryItems) {
        return;
    }

    summaryItems.innerHTML = "";

    cart.forEach((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) {
            return;
        }

        const variantParts = [];
        if (item.size) variantParts.push(`Size: ${item.size}`);
        if (item.color) variantParts.push(`Color: ${item.color}`);
        const variantText = variantParts.length > 0 ? variantParts.join(" &middot; ") : "One size";

        const row = document.createElement("div");
        row.className = "checkout-summary__item";
        row.innerHTML = `
            <img class="checkout-summary__image" src="${product.image}" alt="${product.imageAlt || product.name}" loading="lazy" />
            <div class="checkout-summary__details">
                <p class="checkout-summary__name">${product.name}</p>
                <p class="checkout-summary__meta">${variantText} &middot; Qty ${item.quantity}</p>
            </div>
            <p class="checkout-summary__price">${formatPrice(product.price * item.quantity)}</p>`;

        summaryItems.appendChild(row);
    });

    const totals = calculateCartTotals();

    document.getElementById("checkout-subtotal").textContent = formatPrice(totals.subtotal);
    document.getElementById("checkout-shipping").textContent =
        totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping);

    const discountRow = document.getElementById("checkout-discount-row");
    discountRow.hidden = !(appliedCoupon && totals.discount > 0);
    if (appliedCoupon && totals.discount > 0) {
        document.getElementById("checkout-discount-code").textContent = appliedCoupon.code;
        document.getElementById("checkout-discount").textContent = "-" + formatPrice(totals.discount);
    }

    document.getElementById("checkout-total").textContent = formatPrice(totals.total);
}

/* 11.3 Validation rules (frontend only) */
const checkoutFields = [
    { id: "checkout-name", errorId: "checkout-name-error",
      validate: (value) => value.trim() !== "" },
    { id: "checkout-email", errorId: "checkout-email-error",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
    { id: "checkout-phone", errorId: "checkout-phone-error",
      validate: (value) => /^\d{10}$/.test(value.replace(/[\s-]/g, "")) },
    { id: "checkout-address", errorId: "checkout-address-error",
      validate: (value) => value.trim() !== "" },
    { id: "checkout-city", errorId: "checkout-city-error",
      validate: (value) => value.trim() !== "" },
    { id: "checkout-state", errorId: "checkout-state-error",
      validate: (value) => value.trim() !== "" },
    { id: "checkout-pin", errorId: "checkout-pin-error",
      validate: (value) => /^\d{6}$/.test(value.trim()) }
];

/* 11.4 Field validation with inline errors */
function validateCheckoutField(field) {
    const input = document.getElementById(field.id);
    const errorElement = document.getElementById(field.errorId);
    const isValid = field.validate(input.value);

    input.classList.toggle("is-invalid", !isValid);
    if (errorElement) errorElement.hidden = isValid;

    return isValid;
}

/* 11.5 Place order (no backend — demo confirmation only) */
function placeOrder() {
    if (cart.length === 0) {
        renderCheckout();   // empty bag: guard state + link back to #shop
        return;
    }

    let allValid = true;

    checkoutFields.forEach((field) => {
        if (!validateCheckoutField(field)) {
            allValid = false;
        }
    });

    const paymentError = document.getElementById("checkout-payment-error");
    const paymentSelected = document.querySelector('input[name="payment"]:checked');

    if (!paymentSelected) {
        allValid = false;
        if (paymentError) paymentError.hidden = false;
    } else if (paymentError) {
        paymentError.hidden = true;
    }

    if (!allValid) {
        showToast("Please fix the highlighted fields.");
        return;
    }

    // Capture the order, then clear the EXISTING cart array in place
    const totals = calculateCartTotals();
    const orderId = "SH-" + Math.floor(100000 + Math.random() * 900000);

    // Save the completed order for the account order history
    orders.unshift({
        id: orderId,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        items: cart.map((item) => {
            const product = products.find((p) => p.id === item.id);
            return {
                name: product ? product.name : "Item",
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                price: product ? product.price : 0
            };
        }),
        total: totals.total
    });

    cart.length = 0;
    appliedCoupon = null;
    updateCartCount();
    saveState();

    document.getElementById("checkout-order-id").textContent = orderId;
    document.getElementById("checkout-order-total").textContent = formatPrice(totals.total);

    document.getElementById("checkout-form-view").hidden = true;
    document.getElementById("checkout-confirmation").hidden = false;
    window.scrollTo(0, 0);
}

/* =========================================================
   12. ACCOUNT — LOGIN / REGISTER (simulated, no backend)
   ========================================================= */

/* 12.1 Simulated user storage (localStorage comes later) */
const users = [
    {
        name: "Demo User",
        email: "demo@stylehub.com",
        phone: "9876543210",
        password: "Demo@123"
    }
];

let currentUser = null;

/* 12.2 Open / close the account page */
function openAccountPage() {
    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = true;
    });

    ["product-detail", "cart", "checkout"].forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = true;
    });

    updateAccountUI();

    const accountSection = document.getElementById("account");
    if (accountSection) accountSection.hidden = false;

    window.scrollTo(0, 0);
}

function closeAccountPage() {
    const accountSection = document.getElementById("account");

    if (!accountSection || accountSection.hidden) {
        return;
    }

    accountSection.hidden = true;

    SHOPPING_SECTIONS.forEach((id) => {
        const section = document.getElementById(id);
        if (section) section.hidden = false;
    });
}

/* 12.3 Mode switching (login <-> register) */
function setAccountMode(mode) {
    const isLogin = mode === "login";

    document.getElementById("account-login-form").hidden = !isLogin;
    document.getElementById("account-register-form").hidden = isLogin;

    document.getElementById("account-tab-login").classList.toggle("is-active", isLogin);
    document.getElementById("account-tab-login").setAttribute("aria-pressed", String(isLogin));
    document.getElementById("account-tab-register").classList.toggle("is-active", !isLogin);
    document.getElementById("account-tab-register").setAttribute("aria-pressed", String(!isLogin));

    // Hide stale messages when switching between the two forms
    setFormMessage("account-login-message", "");
    setFormMessage("account-register-message", "");
}

/* 12.4 Inline form messages */
function setFormMessage(id, message, isError) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.hidden = !message;
    element.textContent = message || "";
    element.classList.toggle("is-error", Boolean(isError));
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/* 12.5 Registration (creates a simulated user) */
function registerUser() {
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim().toLowerCase();
    const phone = document.getElementById("register-phone").value.replace(/[\s-]/g, "");
    const password = document.getElementById("register-password").value;
    const confirm = document.getElementById("register-confirm").value;

    if (name === "") {
        setFormMessage("account-register-message", "Please enter your full name.", true);
        return;
    }
    if (!isValidEmail(email)) {
        setFormMessage("account-register-message", "Please enter a valid email address.", true);
        return;
    }
    if (users.some((user) => user.email === email)) {
        setFormMessage("account-register-message", "An account with this email already exists. Please log in.", true);
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        setFormMessage("account-register-message", "Please enter a 10-digit phone number.", true);
        return;
    }
    if (password.length < 8) {
        setFormMessage("account-register-message", "Password must be at least 8 characters long.", true);
        return;
    }
    if (password !== confirm) {
        setFormMessage("account-register-message", "Passwords do not match.", true);
        return;
    }

    users.push({ name: name, email: email, phone: phone, password: password });

    saveState();

    // Switch to login with the new email prefilled
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = "";
    setAccountMode("login");
    setFormMessage("account-login-message", "Account created! Please log in to continue.");
    showToast("Account created successfully.");
}

/* 12.6 Login (validates against the simulated users) */
function loginUser() {
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    if (!isValidEmail(email)) {
        setFormMessage("account-login-message", "Please enter a valid email address.", true);
        return;
    }
    if (password === "") {
        setFormMessage("account-login-message", "Please enter your password.", true);
        return;
    }

    const user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
        setFormMessage("account-login-message", "Invalid email or password. Create an account below if you are new to StyleHub.", true);
        return;
    }

    currentUser = user;
    updateAccountUI();
    saveState();
    showToast(`Welcome back, ${user.name.split(" ")[0]}!`);
}

/* 12.7 Logout */
function logoutUser() {
    currentUser = null;
    updateAccountUI();
    saveState();
    showToast("You have been logged out.");
}

/* 12.8 Refresh the account UI for the current auth state */
function updateAccountUI() {
    const loggedOutView = document.getElementById("account-auth");
    const loggedInView = document.getElementById("account-logged-in");

    if (currentUser) {
        if (loggedOutView) loggedOutView.hidden = true;
        if (loggedInView) {
            loggedInView.hidden = false;
            renderAccountDashboard();
        }
    } else {
        if (loggedOutView) loggedOutView.hidden = false;
        if (loggedInView) loggedInView.hidden = true;
        setAccountMode("login");
    }
}

/* 12.9 Password visibility toggles */
function bindPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    if (!toggle || !input) {
        return;
    }

    toggle.addEventListener("click", () => {
        const showPassword = input.type === "password";

        input.type = showPassword ? "text" : "password";
        toggle.setAttribute("aria-pressed", String(showPassword));
        toggle.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
        toggle.classList.toggle("is-active", showPassword);
    });
}

/* =========================================================
   13. CONTACT FORM (frontend-only demo — no backend)
   ========================================================= */

/* 13.1 Inline validation + success message on submit */
function initContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();   // no page reload — frontend only

        const name = document.getElementById("contact-name");
        const email = document.getElementById("contact-email");
        const message = document.getElementById("contact-message");
        const feedback = document.getElementById("contact-form-message");

        let isValid = true;

        [[name, "contact-name-error", (value) => value.trim() !== ""],
         [email, "contact-email-error", (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())],
         [message, "contact-message-error", (value) => value.trim() !== ""]].forEach(([input, errorId, check]) => {
            const errorElement = document.getElementById(errorId);
            const inputValid = check(input.value);

            input.classList.toggle("is-invalid", !inputValid);
            if (errorElement) errorElement.hidden = inputValid;
            if (!inputValid) isValid = false;
        });

        if (!isValid || !feedback) {
            return;
        }

        feedback.hidden = false;
        feedback.textContent = "Thank you! Your message has been sent — we'll get back to you soon.";
        form.reset();

        [name, email, message].forEach((input) => input.classList.remove("is-invalid"));
        ["contact-name-error", "contact-email-error", "contact-message-error"].forEach((id) => {
            const errorElement = document.getElementById(id);
            if (errorElement) errorElement.hidden = true;
        });
    });
}

/* 13.2 Footer newsletter (frontend-only — no reload) */
function initFooterNewsletter() {
    const form = document.getElementById("footer-newsletter-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const input = document.getElementById("footer-newsletter-email");
        const feedback = document.getElementById("footer-newsletter-message");
        const email = input.value.trim();

        if (!feedback) {
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.hidden = false;
            feedback.textContent = "Please enter a valid email address.";
            feedback.classList.add("is-error");
            feedback.classList.remove("is-success");
            return;
        }

        feedback.hidden = false;
        feedback.textContent = "Thank you for subscribing!";
        feedback.classList.add("is-success");
        feedback.classList.remove("is-error");
        form.reset();
    });
}

/* =========================================================
   14. STATE PERSISTENCE (localStorage)
   ---------------------------------------------------------
   Persists cart, wishlist, orders, users and the current
   session under "stylehub_"-prefixed keys. Passwords are
   NEVER written to storage — the seeded demo user stays in
   memory only, and stored accounts are kept without one.
   ========================================================= */

const STORAGE_PREFIX = "stylehub_";

/** Safe localStorage read — returns null on missing/invalid data. */
function readStoredValue(key) {
    try {
        const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
        return raw === null ? null : JSON.parse(raw);
    } catch (error) {
        return null;   // corrupted or unavailable storage — fail safely
    }
}

/** Safe localStorage write — silently skips unavailable storage. */
function writeStoredValue(key, value) {
    try {
        window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
        /* storage unavailable or full — state simply stays in memory */
    }
}

function removeStoredValue(key) {
    try {
        window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
        /* ignore */
    }
}

/** Copies a user without the password (nothing sensitive is stored). */
function sanitizeUser(user) {
    if (!user || typeof user !== "object") {
        return null;
    }

    return {
        name: typeof user.name === "string" ? user.name : "",
        email: typeof user.email === "string" ? user.email : "",
        phone: typeof user.phone === "string" ? user.phone : "",
        addresses: Array.isArray(user.addresses) ? user.addresses : [],
        sizePreferences: Array.isArray(user.sizePreferences) ? user.sizePreferences : []
    };
}

/** Saves the current app state (called after every state change). */
function saveState() {
    writeStoredValue("cart", cart);
    writeStoredValue("wishlist", wishlist);
    writeStoredValue("orders", orders);

    // Users are stored WITHOUT their passwords
    writeStoredValue("users", users.map((user) => {
        const safe = { ...user };
        delete safe.password;
        return safe;
    }));

    writeStoredValue("currentUser", currentUser ? sanitizeUser(currentUser) : null);
}

/** Restores persisted state when the page starts (safe on bad data). */
function loadState() {
    const savedCart = readStoredValue("cart");
    if (Array.isArray(savedCart)) {
        cart.length = 0;
        savedCart.forEach((item) => {
            if (item && typeof item === "object" && typeof item.id === "number"
                && Number.isInteger(item.quantity) && item.quantity > 0) {
                cart.push({
                    id: item.id,
                    size: item.size || null,
                    color: item.color || null,
                    quantity: item.quantity
                });
            }
        });
    }

    const savedWishlist = readStoredValue("wishlist");
    if (Array.isArray(savedWishlist)) {
        wishlist.length = 0;
        savedWishlist.forEach((id) => {
            if (typeof id === "number") {
                wishlist.push(id);
            }
        });
    }

    const savedOrders = readStoredValue("orders");
    if (Array.isArray(savedOrders)) {
        orders.length = 0;
        savedOrders.forEach((order) => {
            if (order && typeof order === "object" && order.id && Array.isArray(order.items)) {
                orders.push(order);
            }
        });
    }

    const savedUsers = readStoredValue("users");
    if (Array.isArray(savedUsers)) {
        savedUsers.forEach((saved) => {
            if (saved && typeof saved.email === "string"
                && !users.some((user) => user.email === saved.email)) {
                users.push({
                    name: typeof saved.name === "string" ? saved.name : "",
                    email: saved.email,
                    phone: typeof saved.phone === "string" ? saved.phone : "",
                    password: ""
                });
            }
        });
    }

    const savedSession = readStoredValue("currentUser");
    if (savedSession && typeof savedSession === "object"
        && typeof savedSession.email === "string" && typeof savedSession.name === "string") {
        currentUser = {
            name: savedSession.name,
            email: savedSession.email,
            phone: typeof savedSession.phone === "string" ? savedSession.phone : "",
            addresses: Array.isArray(savedSession.addresses) ? savedSession.addresses : [],
            sizePreferences: Array.isArray(savedSession.sizePreferences) ? savedSession.sizePreferences : []
        };
    }
}

/* 12.10 Account dashboard rendering (profile, orders, wishlist,
   addresses, size preferences — all from existing app state) */
function renderAccountDashboard() {
    const user = currentUser;

    if (!user) {
        return;
    }

    // Per-user extras (addresses + size preferences)
    if (!Array.isArray(user.addresses)) {
        user.addresses = [];
    }
    if (!Array.isArray(user.sizePreferences)) {
        user.sizePreferences = [];
    }

    document.getElementById("account-user-name").textContent = user.name;
    document.getElementById("account-profile-name").textContent = user.name;
    document.getElementById("account-profile-email").textContent = user.email;
    document.getElementById("account-profile-phone").textContent = user.phone || "—";

    renderAccountOrders();
    renderAccountWishlist();
    renderAccountAddresses();
    renderAccountSizePreferences();
}

function renderAccountOrders() {
    const wrap = document.getElementById("account-orders");

    if (!wrap) {
        return;
    }

    wrap.innerHTML = "";

    if (orders.length === 0) {
        const note = document.createElement("p");
        note.className = "account-empty-note";
        note.textContent = "No orders yet — your completed orders will appear here.";
        wrap.appendChild(note);
        return;
    }

    orders.forEach((order) => {
        const itemsText = order.items
            .map((item) => `${item.name} × ${item.quantity}`)
            .join(", ");

        const row = document.createElement("div");
        row.className = "account-order";

        const head = document.createElement("div");
        head.className = "account-order__head";

        const id = document.createElement("p");
        id.className = "account-order__id";
        id.textContent = `Order ${order.id}`;

        const date = document.createElement("p");
        date.className = "account-order__date";
        date.textContent = order.date;

        const items = document.createElement("p");
        items.className = "account-order__items";
        items.textContent = itemsText;

        const total = document.createElement("p");
        total.className = "account-order__total";
        total.textContent = formatPrice(order.total);

        head.appendChild(id);
        head.appendChild(date);
        row.appendChild(head);
        row.appendChild(items);
        row.appendChild(total);
        wrap.appendChild(row);
    });
}

function renderAccountWishlist() {
    const grid = document.getElementById("account-wishlist-grid");
    const emptyNote = document.getElementById("account-wishlist-empty");

    if (!grid || !emptyNote) {
        return;
    }

    const savedProducts = products.filter((product) => wishlist.includes(product.id));

    emptyNote.hidden = savedProducts.length > 0;
    grid.hidden = savedProducts.length === 0;

    renderProducts(savedProducts, grid);
}

function renderAccountAddresses() {
    const wrap = document.getElementById("account-addresses");
    const emptyNote = document.getElementById("account-addresses-empty");
    const user = currentUser;

    if (!wrap || !emptyNote || !user) {
        return;
    }

    wrap.innerHTML = "";
    emptyNote.hidden = user.addresses.length > 0;

    user.addresses.forEach((address, index) => {
        const row = document.createElement("div");
        row.className = "account-address";

        const text = document.createElement("p");
        text.className = "account-address__text";
        text.textContent = address;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "cart-item__remove";
        remove.dataset.addressRemove = String(index);
        remove.setAttribute("aria-label", "Delete saved address");
        remove.textContent = "Delete";

        row.appendChild(text);
        row.appendChild(remove);
        wrap.appendChild(row);
    });
}

function addAccountAddress() {
    const input = document.getElementById("account-address-input");

    if (!input || !currentUser) {
        return;
    }

    const value = input.value.trim();

    if (value === "") {
        setFormMessage("account-address-message", "Please enter an address first.", true);
        return;
    }

    currentUser.addresses.push(value);
    input.value = "";
    setFormMessage("account-address-message", "Address saved.", false);
    renderAccountAddresses();
    saveState();
}

function removeAccountAddress(index) {
    if (!currentUser || !currentUser.addresses[index]) {
        return;
    }

    currentUser.addresses.splice(index, 1);
    renderAccountAddresses();
    saveState();
}

function renderAccountSizePreferences() {
    const wrap = document.getElementById("account-size-preferences");
    const user = currentUser;

    if (!wrap || !user) {
        return;
    }

    wrap.innerHTML = "";

    getUniqueValues(products, "sizes").forEach((size) => {
        const selected = user.sizePreferences.includes(size);

        const choice = document.createElement("button");
        choice.type = "button";
        choice.className = "detail-choice" + (selected ? " is-selected" : "");
        choice.textContent = size;
        choice.dataset.size = size;
        choice.setAttribute("aria-pressed", String(selected));

        wrap.appendChild(choice);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("StyleHub: script.js loaded successfully.");

    // Restore persisted state before anything renders
    loadState();

    /* =========================================================
       1. MOBILE NAVIGATION (hamburger menu)
       ========================================================= */
    const header = document.getElementById("site-header");
    const navToggle = document.getElementById("nav-toggle");
    const primaryNav = document.getElementById("primary-navigation");

    // Width below which the mobile menu is used (must match the CSS breakpoint)
    const MOBILE_BREAKPOINT = 992;

    if (header && navToggle && primaryNav) {
        /** Returns true when the mobile menu is currently open. */
        const isMenuOpen = () => primaryNav.classList.contains("is-open");

        /** Opens (open = true) or closes (open = false) the mobile menu. */
        const setMenuState = (open) => {
            navToggle.classList.toggle("is-active", open);   // hamburger -> X
            primaryNav.classList.toggle("is-open", open);    // show/hide panel
            navToggle.setAttribute("aria-expanded", String(open));
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        };

        // Hamburger click: toggle open <-> close
        navToggle.addEventListener("click", () => {
            setMenuState(!isMenuOpen());
        });

        // Close the menu after choosing a link (mobile UX)
        primaryNav.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                setMenuState(false);
            }
        });

        // Close the menu with the Escape key (accessibility)
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && isMenuOpen()) {
                setMenuState(false);
                navToggle.focus();
            }
        });

        // Close the menu when clicking / tapping outside the header
        document.addEventListener("click", (event) => {
            if (isMenuOpen() && !header.contains(event.target)) {
                setMenuState(false);
            }
        });

        // Reset the menu state when resizing back up to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > MOBILE_BREAKPOINT && isMenuOpen()) {
                setMenuState(false);
            }
        }, { passive: true });
    }

    /* =========================================================
       2. HEADER SHADOW WHILE SCROLLING
       ========================================================= */
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("is-scrolled", window.scrollY > 10);
        }, { passive: true });
    }

    /* =========================================================
       7.6 FEATURED PRODUCTS: render + events
       ========================================================= */
    const featuredGrid = document.getElementById("featured-product-grid");

    if (featuredGrid) {
        renderProducts(products, featuredGrid);
    }

    /* =========================================================
       7.7 COLLECTIONS: render men / women / kids
       ========================================================= */
    renderCollection("men", "mens-product-grid");
    renderCollection("women", "womens-product-grid");
    renderCollection("kids", "kids-product-grid");

    // One delegated handler per product grid covers the wishlist
    // hearts and the "Add to Bag" buttons (featured + collections),
    // so every section behaves exactly like Featured Products.
    document.querySelectorAll(".product-grid").forEach((grid) => {
        grid.addEventListener("click", (event) => {
            const wishlistButton = event.target.closest("[data-wishlist-id]");

            if (wishlistButton) {
                toggleWishlist(Number(wishlistButton.dataset.wishlistId), wishlistButton);
                return;
            }

            const addButton = event.target.closest("[data-add-id]");

            if (addButton) {
                addToCart(Number(addButton.dataset.addId));
                return;
            }

            // Product image / name -> open the detail view
            const detailLink = event.target.closest("[data-product-id]");

            if (detailLink) {
                event.preventDefault();
                const section = detailLink.closest("section");
                openProductDetail(Number(detailLink.dataset.productId), {
                    returnSection: section ? section.id : "shop"
                });
            }
        });
    });

    /* =========================================================
       8.7 SHOP: init controls + event listeners
       ========================================================= */
    if (document.getElementById("shop")) {
        initShopControls();
        renderShop();

        // Live search
        document.getElementById("shop-search-input").addEventListener("input", (event) => {
            shopState.search = event.target.value;
            renderShop();
        });

        // Category / size / color / brand selects
        [["shop-filter-category", "category"],
         ["shop-filter-size", "size"],
         ["shop-filter-color", "color"],
         ["shop-filter-brand", "brand"]].forEach(([id, key]) => {
            document.getElementById(id).addEventListener("change", (event) => {
                shopState[key] = event.target.value;
                renderShop();
            });
        });

        // Price range slider
        document.getElementById("shop-filter-price").addEventListener("input", (event) => {
            shopState.maxPrice = Number(event.target.value);

            const priceValue = document.getElementById("shop-price-value");
            if (priceValue) priceValue.textContent = formatPrice(shopState.maxPrice);

            renderShop();
        });

        // Sorting
        document.getElementById("shop-sort").addEventListener("change", (event) => {
            shopState.sort = event.target.value;
            renderShop();
        });

        // Clear All + empty-state "Reset Filters" (same behaviour)
        document.getElementById("shop-clear").addEventListener("click", clearShopFilters);
        document.getElementById("shop-reset").addEventListener("click", clearShopFilters);
    }

    /* =========================================================
       9.10 PRODUCT DETAIL: wiring
       ========================================================= */
    const detailSection = document.getElementById("product-detail");

    if (detailSection) {
        // Back to shop
        document.getElementById("detail-back").addEventListener("click", closeProductDetail);

        // Color selection (delegated inside the choices group)
        document.getElementById("detail-colors").addEventListener("click", (event) => {
            const choice = event.target.closest("[data-color]");
            if (choice) selectProductColor(choice.dataset.color);
        });

        // Size selection (delegated inside the choices group)
        document.getElementById("detail-sizes").addEventListener("click", (event) => {
            const choice = event.target.closest("[data-size]");
            if (choice) selectProductSize(choice.dataset.size);
        });

        // Quantity stepper (minimum 1)
        document.getElementById("detail-qty-minus").addEventListener("click", () => {
            updateProductQuantity(detailQuantity - 1);
        });
        document.getElementById("detail-qty-plus").addEventListener("click", () => {
            updateProductQuantity(detailQuantity + 1);
        });

        // Add to bag with the selected variant + quantity
        document.getElementById("detail-add").addEventListener("click", () => {
            const product = products.find((item) => item.id === currentDetailProduct);

            if (!product) {
                return;
            }

            const sizeRequired = Array.isArray(product.sizes) && product.sizes.length > 0;

            if (sizeRequired && !detailSelectedSize) {
                document.getElementById("detail-size-error").hidden = false;
                return;
            }

            addToCart(product.id, {
                size: detailSelectedSize,
                color: detailSelectedColor,
                quantity: detailQuantity
            });
        });

        // Wishlist on the detail page (reuses existing wishlist logic)
        const detailWishlist = document.getElementById("detail-wishlist");
        detailWishlist.addEventListener("click", () => {
            if (currentDetailProduct === null) {
                return;
            }

            toggleWishlist(currentDetailProduct, detailWishlist);

            const product = products.find((item) => item.id === currentDetailProduct);
            if (product) {
                updateDetailWishlist(product);
            }
        });

        // Size guide modal
        document.getElementById("detail-size-guide").addEventListener("click", openSizeGuide);

        const sizeGuide = document.getElementById("size-guide");
        sizeGuide.addEventListener("click", (event) => {
            if (event.target.closest("[data-size-guide-close]")) {
                closeSizeGuide();
            }
        });
        document.getElementById("size-guide-close").addEventListener("click", closeSizeGuide);

        // Keep Tab focus inside the modal while it is open
        const sizeGuideDialog = sizeGuide.querySelector(".size-guide__dialog");
        sizeGuideDialog.addEventListener("keydown", (event) => {
            if (event.key !== "Tab") {
                return;
            }

            const focusable = sizeGuideDialog.querySelectorAll("button, [href], input, select, [tabindex]:not([tabindex='-1'])");
            if (focusable.length === 0) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        // Escape closes the size guide only
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !document.getElementById("size-guide").hidden) {
                closeSizeGuide();
            }
        });

        // Open detail from URL hash + react to hash changes
        window.addEventListener("hashchange", handleProductHash);
        handleProductHash();
    }

    /* =========================================================
       10.7 SHOPPING CART: wiring
       ========================================================= */
    const cartSection = document.getElementById("cart");

    if (cartSection) {
        // Header bag button opens the cart page
        const cartButton = document.getElementById("cart-btn");
        if (cartButton) {
            cartButton.addEventListener("click", openCartPage);
        }

        // Quantity +/- and Remove (delegated; no page reload)
        document.getElementById("cart-items").addEventListener("click", (event) => {
            const decreaseButton = event.target.closest("[data-cart-decrease]");

            if (decreaseButton) {
                changeCartQuantity(Number(decreaseButton.dataset.cartDecrease), -1);
                return;
            }

            const increaseButton = event.target.closest("[data-cart-increase]");

            if (increaseButton) {
                changeCartQuantity(Number(increaseButton.dataset.cartIncrease), 1);
                return;
            }

            const removeButton = event.target.closest("[data-cart-remove]");

            if (removeButton) {
                removeCartItem(Number(removeButton.dataset.cartRemove));
            }
        });

        // Coupons
        const couponInput = document.getElementById("cart-coupon-input");
        document.getElementById("cart-coupon-apply").addEventListener("click", () => {
            applyCoupon(couponInput.value);
        });
        couponInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                applyCoupon(couponInput.value);
            }
        });

        // Checkout opens the dedicated checkout page (hash: #checkout)
    }

    /* =========================================================
       11.7 CHECKOUT: wiring
       ========================================================= */
    if (document.getElementById("checkout")) {
        document.getElementById("checkout-place-order").addEventListener("click", placeOrder);

        // Clear inline errors as the user fixes each field
        checkoutFields.forEach((field) => {
            document.getElementById(field.id).addEventListener("input", () => {
                validateCheckoutField(field);
            });
        });

        // Clear the payment error as soon as a method is chosen
        document.getElementById("checkout-payment").addEventListener("change", () => {
            const paymentError = document.getElementById("checkout-payment-error");
            if (paymentError) paymentError.hidden = true;
        });
    }

    /* =========================================================
       12.10 ACCOUNT: wiring
       ========================================================= */
    if (document.getElementById("account")) {
        document.getElementById("account-btn").addEventListener("click", openAccountPage);

        document.getElementById("account-tab-login").addEventListener("click", () => setAccountMode("login"));
        document.getElementById("account-tab-register").addEventListener("click", () => setAccountMode("register"));

        document.getElementById("account-switch-register").addEventListener("click", (event) => {
            event.preventDefault();
            setAccountMode("register");
        });
        document.getElementById("account-switch-login").addEventListener("click", (event) => {
            event.preventDefault();
            setAccountMode("login");
        });

        document.getElementById("account-login-submit").addEventListener("click", loginUser);
        document.getElementById("account-register-submit").addEventListener("click", registerUser);
        document.getElementById("account-logout").addEventListener("click", logoutUser);

        bindPasswordToggle("login-password-toggle", "login-password");
        bindPasswordToggle("register-password-toggle", "register-password");
        bindPasswordToggle("register-confirm-toggle", "register-confirm");

        // Saved addresses: add via button or Enter key, delete via row button
        document.getElementById("account-address-add").addEventListener("click", addAccountAddress);
        document.getElementById("account-address-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                addAccountAddress();
            }
        });

        document.getElementById("account-addresses").addEventListener("click", (event) => {
            const removeButton = event.target.closest("[data-address-remove]");

            if (removeButton) {
                removeAccountAddress(Number(removeButton.dataset.addressRemove));
            }
        });

        // Size preferences: tap a size to save / unsave it
        document.getElementById("account-size-preferences").addEventListener("click", (event) => {
            const choice = event.target.closest("[data-size]");

            if (!choice || !currentUser) {
                return;
            }

            const size = choice.dataset.size;
            const sizeIndex = currentUser.sizePreferences.indexOf(size);

            if (sizeIndex === -1) {
                currentUser.sizePreferences.push(size);
            } else {
                currentUser.sizePreferences.splice(sizeIndex, 1);
            }

            renderAccountSizePreferences();
            saveState();
        });

        // Clear the login message as the user types
        ["login-email", "login-password"].forEach((id) => {
            document.getElementById(id).addEventListener("input", () => {
                setFormMessage("account-login-message", "");
            });
        });
    }

    /* =========================================================
       14. CONTACT: wiring
       ========================================================= */
    initContactForm();
    initFooterNewsletter();

    /* =========================================================
       3. FOOTER COPYRIGHT YEAR
       ========================================================= */
    const copyrightYear = document.getElementById("copyright-year");
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
});
