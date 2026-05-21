// ============ FIREBASE IMPORTS ============
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrXk_ltbvHPqbGnD_tIq8u9iNa_R3Bnlc",
  authDomain: "cr7-clothing-b4d5f.firebaseapp.com",
  projectId: "cr7-clothing-b4d5f",
  storageBucket: "cr7-clothing-b4d5f.firebasestorage.app",
  messagingSenderId: "671815729334",
  appId: "1:671815729334:web:d329c18205262c5221a617",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============ DATA MODELS ============
let products = [];
let cart = [];
let communityMessages = [];
let feedbacks = [];
let announcements = ["🔥 New Summer Collection Dropping Soon!"];
let orders = [];

// ============ LOAD DATA FROM FIREBASE ============
async function loadAllData() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    if (!productsSnapshot.empty) {
      products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      products = [
        {
          id: "m1",
          name: "Men's Classic Oxford Shirt",
          price: 49,
          category: "men",
          stock: 30,
          type: "shirt",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Shirt",
        },
        {
          id: "m4",
          name: "Men's Cotton Crew Neck Tee",
          price: 19,
          category: "men",
          stock: 50,
          type: "tee",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Crew+Tee",
        },
        {
          id: "m7",
          name: "Men's Slim Fit Jeans",
          price: 59,
          category: "men",
          stock: 35,
          type: "jeans",
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Slim+Jeans",
        },
        {
          id: "w1",
          name: "Women's Casual Shirt",
          price: 45,
          category: "women",
          stock: 35,
          type: "shirt",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Shirt",
        },
        {
          id: "w3",
          name: "Women's Crop Top Tee",
          price: 22,
          category: "women",
          stock: 45,
          type: "tee",
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Crop+Tee",
        },
        {
          id: "w5",
          name: "Women's Skinny Jeans",
          price: 55,
          category: "women",
          stock: 35,
          type: "jeans",
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Skinny+Jeans",
        },
        {
          id: "a1",
          name: "Premium Leather Handbag",
          price: 89,
          category: "accessories",
          stock: 20,
          type: "handbag",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Handbag",
        },
        {
          id: "a3",
          name: "Smart Watch",
          price: 129,
          category: "accessories",
          stock: 25,
          type: "watch",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Smart+Watch",
        },
      ];
      for (const product of products) {
        await addDoc(collection(db, "products"), product);
      }
    }

    const feedbackSnapshot = await getDocs(collection(db, "feedbacks"));
    if (!feedbackSnapshot.empty) {
      feedbacks = feedbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    const messagesSnapshot = await getDocs(collection(db, "messages"));
    if (!messagesSnapshot.empty) {
      communityMessages = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    const ordersSnapshot = await getDocs(collection(db, "orders"));
    if (!ordersSnapshot.empty) {
      orders = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    const savedAnnounce = localStorage.getItem("cr7_announce");
    if (savedAnnounce) announcements = JSON.parse(savedAnnounce);

    renderProducts();
    renderCommunityMessages();
    renderAdminFeedback();
    renderOrders();
    renderAnnouncementsList();
    renderAnnouncementBanner();
    updateCartUI();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// ============ UI FUNCTIONS ============
function showToast(message) {
  const toast = document.getElementById("toastMsg");
  if (toast) {
    toast.textContent = message;
    toast.style.opacity = "1";
    setTimeout(() => (toast.style.opacity = "0"), 1800);
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById("cartCountBadge");
  if (badge) badge.innerText = totalItems;
  localStorage.setItem("cr7_cart", JSON.stringify(cart));
}

function renderProducts(filterCategory = null) {
  let filtered =
    filterCategory === "all"
      ? [...products].sort(() => Math.random() - 0.5)
      : filterCategory && filterCategory !== "all"
        ? products.filter((p) => p.category === filterCategory)
        : products;

  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML =
      "<div style='text-align:center; padding:40px;'>No products found.</div>";
    return;
  }

  grid.innerHTML = filtered
    .map(
      (product) => `
    <div class="product-card">
      <img class="product-img" src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-price">$${product.price}</div>
        <div style="font-size:0.75rem; color:#888;">📦 Stock: ${product.stock}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `,
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.getAttribute("data-id"));
    });
  });
}

// ============ CART MODAL FUNCTIONS ============
let currentCartView = "cart"; // cart, delivery, payment

function openCartModal() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some products first.");
    return;
  }
  renderCartItems();
  document.getElementById("cartModal").style.display = "flex";
  currentCartView = "cart";
  showCartSection();
}

function renderCartItems() {
  const container = document.getElementById("cartItemsList");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<div class='empty-cart'>Your cart is empty</div>";
    document.getElementById("cartSubtotal").innerText = "$0";
    document.getElementById("cartGrandTotal").innerText = "$0";
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart
    .map((item) => {
      subtotal += item.price * item.quantity;
      return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="remove-item" data-id="${item.id}">🗑️</button>
      </div>
    `;
    })
    .join("");

  document.getElementById("cartSubtotal").innerText = `$${subtotal}`;
  document.getElementById("cartGrandTotal").innerText = `$${subtotal}`;

  // Add event listeners for quantity buttons
  document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
    btn.addEventListener("click", () => updateCartQuantity(btn.dataset.id, -1));
  });
  document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
    btn.addEventListener("click", () => updateCartQuantity(btn.dataset.id, 1));
  });
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => removeCartItem(btn.dataset.id));
  });
}

function updateCartQuantity(productId, change) {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      removeCartItem(productId);
    } else {
      item.quantity = newQty;
      saveCart();
      renderCartItems();
      updateCartUI();
    }
  }
}

function removeCartItem(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  renderCartItems();
  updateCartUI();
  if (cart.length === 0) {
    document.getElementById("cartModal").style.display = "none";
  }
}

function saveCart() {
  localStorage.setItem("cr7_cart", JSON.stringify(cart));
}

function showCartSection() {
  document.getElementById("cartItemsList").style.display = "block";
  document.getElementById("deliverySection").style.display = "none";
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("orderSuccessAnim").style.display = "none";
}

function showDeliverySection() {
  if (cart.length === 0) return;
  document.getElementById("cartItemsList").style.display = "none";
  document.getElementById("deliverySection").style.display = "block";
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("orderSuccessAnim").style.display = "none";
}

function showPaymentSection() {
  document.getElementById("cartItemsList").style.display = "none";
  document.getElementById("deliverySection").style.display = "none";
  document.getElementById("paymentSection").style.display = "block";
  document.getElementById("orderSuccessAnim").style.display = "none";
}

// Payment method change
document.querySelectorAll("input[name='paymentMethod']").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const msgDiv = document.getElementById("onlinePaymentMsg");
    if (msgDiv) {
      msgDiv.style.display = e.target.value === "online" ? "block" : "none";
    }
  });
});

// Place order with COD
async function placeCODOrder() {
  const name = document.getElementById("deliveryName").value.trim();
  const email = document.getElementById("deliveryEmail").value.trim();
  const phone = document.getElementById("deliveryPhone").value.trim();
  const address = document.getElementById("deliveryAddress").value.trim();

  if (!name || !email || !phone || !address) {
    alert("Please fill all delivery details");
    return;
  }

  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
    const product = products.find((p) => p.id === item.id);
    if (product) {
      product.stock -= item.quantity;
      await updateDoc(doc(db, "products", product.id), {
        stock: product.stock,
      });
    }
  }

  const order = {
    customer: { name, email, phone, address },
    notes: document.getElementById("deliveryNotes").value,
    items: cart.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    total: total,
    date: new Date().toLocaleString(),
    status: "Pending",
    paymentMethod: "COD",
  };

  await addDoc(collection(db, "orders"), order);

  cart = [];
  updateCartUI();
  saveCart();

  document.getElementById("orderSuccessAnim").style.display = "block";
  document.getElementById("paymentSection").style.display = "none";

  setTimeout(() => {
    document.getElementById("cartModal").style.display = "none";
    resetCartModal();
  }, 3000);
}

function resetCartModal() {
  document.getElementById("deliveryForm").reset();
  document.getElementById("cartItemsList").style.display = "block";
  document.getElementById("deliverySection").style.display = "none";
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("orderSuccessAnim").style.display = "none";
}

// Setup cart modal event listeners
function setupCartModalListeners() {
  const cartBtn = document.getElementById("cartIconBtn");
  if (cartBtn) cartBtn.addEventListener("click", openCartModal);

  document.querySelector(".cart-modal-close")?.addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
    resetCartModal();
  });

  document
    .getElementById("continueShoppingBtn")
    ?.addEventListener("click", () => {
      document.getElementById("cartModal").style.display = "none";
      resetCartModal();
    });

  document
    .getElementById("proceedToDeliveryBtn")
    ?.addEventListener("click", showDeliverySection);
  document
    .getElementById("backToCartBtn")
    ?.addEventListener("click", showCartSection);
  document
    .getElementById("proceedToPaymentBtn")
    ?.addEventListener("click", showPaymentSection);
  document
    .getElementById("backToDeliveryBtn")
    ?.addEventListener("click", showDeliverySection);
  document
    .getElementById("placeOrderFinalBtn")
    ?.addEventListener("click", () => {
      const selectedPayment = document.querySelector(
        "input[name='paymentMethod']:checked",
      )?.value;
      if (selectedPayment === "cod") {
        placeCODOrder();
      } else {
        alert("Online payment coming soon! Please select Cash on Delivery.");
      }
    });
  document.getElementById("closeSuccessBtn")?.addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
    resetCartModal();
  });
}

// ============ SUBCATEGORY TOGGLE FUNCTION ============
function setupSubcategoryToggles() {
  console.log("setupSubcategoryToggles called!");

  // Hide all subcategory rows
  function hideAllSubRows() {
    const subMen = document.getElementById("subMen");
    const subWomen = document.getElementById("subWomen");
    const subAccessories = document.getElementById("subAccessories");

    if (subMen) subMen.style.display = "none";
    if (subWomen) subWomen.style.display = "none";
    if (subAccessories) subAccessories.style.display = "none";
  }

  // Get category cards
  const menCard = document.querySelector('.category-card[data-cat="men"]');
  const womenCard = document.querySelector('.category-card[data-cat="women"]');
  const accessoriesCard = document.querySelector(
    '.category-card[data-cat="accessories"]',
  );
  const allCard = document.querySelector('.category-card[data-cat="all"]');

  console.log("menCard found:", menCard);
  console.log("womenCard found:", womenCard);
  console.log("accessoriesCard found:", accessoriesCard);

  // MENS Category
  if (menCard) {
    menCard.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("MENS clicked!");
      const subRow = document.getElementById("subMen");
      if (subRow) {
        hideAllSubRows();
        if (subRow.style.display === "none" || subRow.style.display === "") {
          subRow.style.display = "flex";
          console.log("subMen displayed");
        } else {
          subRow.style.display = "none";
        }
      } else {
        console.log("subMen element not found!");
      }
    });
  }

  // GIRLS Category
  if (womenCard) {
    womenCard.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("GIRLS clicked!");
      const subRow = document.getElementById("subWomen");
      if (subRow) {
        hideAllSubRows();
        if (subRow.style.display === "none" || subRow.style.display === "") {
          subRow.style.display = "flex";
        } else {
          subRow.style.display = "none";
        }
      }
    });
  }

  // ACCESSORIES Category
  if (accessoriesCard) {
    accessoriesCard.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("ACCESSORIES clicked!");
      const subRow = document.getElementById("subAccessories");
      if (subRow) {
        hideAllSubRows();
        if (subRow.style.display === "none" || subRow.style.display === "") {
          subRow.style.display = "flex";
        } else {
          subRow.style.display = "none";
        }
      }
    });
  }

  // ALL Category
  if (allCard) {
    allCard.addEventListener("click", () => {
      console.log("ALL clicked!");
      hideAllSubRows();
      const randomProducts = [...products].sort(() => Math.random() - 0.5);
      const grid = document.getElementById("productGrid");
      if (grid) {
        grid.innerHTML = randomProducts
          .map(
            (product) => `
          <div class="product-card">
            <img class="product-img" src="${product.image}" alt="${product.name}">
            <div class="product-info">
              <div class="product-title">${product.name}</div>
              <div class="product-price">$${product.price}</div>
              <div style="font-size:0.75rem; color:#888;">📦 Stock: ${product.stock}</div>
              <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        `,
          )
          .join("");
        document.querySelectorAll(".add-to-cart").forEach((btn) => {
          btn.addEventListener("click", () =>
            addToCart(btn.getAttribute("data-id")),
          );
        });
      }
    });
  }

  // Subcategory buttons
  document.querySelectorAll(".subcat-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const category = btn.getAttribute("data-cat");
      const type = btn.getAttribute("data-type");
      console.log("Subcategory clicked:", category, type);

      let filtered =
        type === "all"
          ? products.filter((p) => p.category === category)
          : products.filter((p) => p.category === category && p.type === type);

      const grid = document.getElementById("productGrid");
      if (filtered.length === 0) {
        grid.innerHTML = `<div style='text-align:center; padding:40px;'>No products found</div>`;
      } else {
        grid.innerHTML = filtered
          .map(
            (product) => `
          <div class="product-card">
            <img class="product-img" src="${product.image}" alt="${product.name}">
            <div class="product-info">
              <div class="product-title">${product.name}</div>
              <div class="product-price">$${product.price}</div>
              <div style="font-size:0.75rem; color:#888;">📦 Stock: ${product.stock}</div>
              <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        `,
          )
          .join("");
        document.querySelectorAll(".add-to-cart").forEach((btn) => {
          btn.addEventListener("click", () =>
            addToCart(btn.getAttribute("data-id")),
          );
        });
      }
      hideAllSubRows();
    });
  });
}

// ============ OTHER FUNCTIONS ============
function showOrderModal() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  const modal = document.getElementById("orderModal");
  if (modal) modal.style.display = "flex";
}

async function placeOrderWithDetails() {
  const name = document.getElementById("customerName")?.value.trim();
  const email = document.getElementById("customerEmail")?.value.trim();
  const phone = document.getElementById("customerPhone")?.value.trim();
  const address = document.getElementById("customerAddress")?.value.trim();

  if (!name || !email || !phone || !address) {
    alert("Please fill all required fields");
    return;
  }

  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
    const product = products.find((p) => p.id === item.id);
    if (product) {
      product.stock -= item.quantity;
      await updateDoc(doc(db, "products", product.id), {
        stock: product.stock,
      });
    }
  }

  const order = {
    customer: { name, email, phone, address },
    notes: document.getElementById("orderNotes")?.value || "",
    items: cart.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    total: total,
    date: new Date().toLocaleString(),
    status: "Pending",
  };

  await addDoc(collection(db, "orders"), order);

  const form = document.getElementById("orderForm");
  const success = document.getElementById("orderSuccess");
  if (form) form.style.display = "none";
  if (success) success.style.display = "block";

  cart = [];
  updateCartUI();

  setTimeout(() => {
    const modal = document.getElementById("orderModal");
    if (modal) modal.style.display = "none";
    if (form) form.reset();
    if (form) form.style.display = "block";
    if (success) success.style.display = "none";
  }, 2000);
}

// ============ ADMIN FUNCTIONS (simplified) ============
function renderAdminTable() {
  const body = document.getElementById("adminStockBody");
  if (!body) return;
  body.innerHTML = products
    .map(
      (p) => `
    <tr><td>${p.id.substring(0, 8)}</td><td>${p.name}</td><td>$${p.price}</td><td>${p.stock}</td><td><button onclick="deleteProduct('${p.id}')">Delete</button></td></tr>
  `,
    )
    .join("");
}

function renderAdminFeedback() {
  /* keep existing */
}
function renderOrders() {
  /* keep existing */
}
function renderAnnouncementsList() {
  /* keep existing */
}
function renderAnnouncementBanner() {
  /* keep existing */
}
function renderCommunityMessages() {
  /* keep existing */
}
function sendChatMessage() {
  /* keep existing */
}
function submitFeedback() {
  /* keep existing */
}
function setMode(admin) {
  /* keep existing */
}
function openCommunityModal() {
  /* keep existing */
}
function closeCommunityModal() {
  /* keep existing */
}

function setupEventListeners() {
  const cartBtn = document.getElementById("cartIconBtn");
  if (cartBtn) cartBtn.addEventListener("click", showOrderModal);

  const orderForm = document.getElementById("orderForm");
  if (orderForm)
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      placeOrderWithDetails();
    });

  const closeModal = document.querySelector(".order-modal-close");
  if (closeModal)
    closeModal.addEventListener("click", () => {
      document.getElementById("orderModal").style.display = "none";
    });

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn)
    searchBtn.addEventListener("click", () => {
      document.getElementById("searchModal").style.display = "flex";
    });

  const closeSearch = document.getElementById("closeSearchBtn");
  if (closeSearch)
    closeSearch.addEventListener("click", () => {
      document.getElementById("searchModal").style.display = "none";
    });
}

// ============ INITIALIZATION ============
async function init() {
  await loadAllData();
  setupEventListeners();

  const savedCart = localStorage.getItem("cr7_cart");
  if (savedCart) cart = JSON.parse(savedCart);
  updateCartUI();

  const adminPanel = document.getElementById("adminPanel");
  const customerMain = document.getElementById("customerMain");
  const adminContainer = document.getElementById("adminPanelContainer");

  if (adminPanel) adminPanel.classList.remove("active");
  if (adminContainer) adminContainer.style.display = "none";
  if (customerMain) customerMain.style.display = "block";

  setMode(false);

  // Call subcategory toggle setup
  setupSubcategoryToggles();
}

init();
