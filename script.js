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
  onSnapshot,
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
    // Load Products
    const productsSnapshot = await getDocs(collection(db, "products"));
    if (!productsSnapshot.empty) {
      products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      // Initial products if empty
      products = [
        {
          id: "1",
          name: "Oversized Linen Shirt",
          price: 79,
          category: "men",
          stock: 15,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Linen+Shirt",
          tag: "new",
        },
        {
          id: "2",
          name: "Merino Wool Sweater",
          price: 119,
          category: "men",
          stock: 8,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Wool+Sweater",
          tag: "eco",
        },
        {
          id: "3",
          name: "Flowy Midi Dress",
          price: 99,
          category: "women",
          stock: 12,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Midi+Dress",
          tag: "bestseller",
        },
        {
          id: "4",
          name: "Cropped Organic Jacket",
          price: 139,
          category: "women",
          stock: 5,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Jacket",
          tag: "new",
        },
        {
          id: "5",
          name: "Canvas Tote Bag",
          price: 49,
          category: "accessories",
          stock: 20,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Tote+Bag",
          tag: "eco",
        },
      ];
      // Save initial products to Firebase
      for (const product of products) {
        await addDoc(collection(db, "products"), product);
      }
    }

    // Load Feedbacks
    const feedbackSnapshot = await getDocs(collection(db, "feedbacks"));
    if (!feedbackSnapshot.empty) {
      feedbacks = feedbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Load Messages
    const messagesSnapshot = await getDocs(collection(db, "messages"));
    if (!messagesSnapshot.empty) {
      communityMessages = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Load Orders
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    if (!ordersSnapshot.empty) {
      orders = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Load Announcements from localStorage (admin only)
    const savedAnnounce = localStorage.getItem("cr7_announce");
    if (savedAnnounce) announcements = JSON.parse(savedAnnounce);

    // Render UI
    renderProducts();
    renderCommunityMessages();
    renderAdminFeedback();
    renderOrders();
    renderAnnouncementsList();
    renderAnnouncementBanner();
    updateCartUI();
  } catch (error) {
    console.error("Error loading data:", error);
    showToast("Error connecting to database. Using local data.");
  }
}

// ============ FIREBASE CRUD OPERATIONS ============

// Add Product
async function addProductToFirebase(product) {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    product.id = docRef.id;
    products.push(product);
    renderProducts();
    renderAdminTable();
    showToast("Product added successfully!");
  } catch (error) {
    console.error("Error adding product:", error);
    showToast("Failed to add product");
  }
}

// Update Product
async function updateProductInFirebase(productId, updates) {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, updates);
    const index = products.findIndex((p) => p.id === productId);
    if (index !== -1) products[index] = { ...products[index], ...updates };
    renderProducts();
    renderAdminTable();
    showToast("Product updated!");
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

// Delete Product
async function deleteProductFromFirebase(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    products = products.filter((p) => p.id !== productId);
    renderProducts();
    renderAdminTable();
    showToast("Product deleted!");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

// Add Feedback
async function addFeedbackToFirebase(text) {
  try {
    const feedback = { text, date: new Date().toLocaleString(), reply: "" };
    const docRef = await addDoc(collection(db, "feedbacks"), feedback);
    feedback.id = docRef.id;
    feedbacks.push(feedback);
    renderAdminFeedback();
    showToast("Feedback submitted! Admin will review.");
  } catch (error) {
    console.error("Error adding feedback:", error);
  }
}

// Update Feedback Reply
async function updateFeedbackReply(feedbackId, reply) {
  try {
    const feedbackRef = doc(db, "feedbacks", feedbackId);
    await updateDoc(feedbackRef, { reply });
    const index = feedbacks.findIndex((f) => f.id === feedbackId);
    if (index !== -1) feedbacks[index].reply = reply;
    renderAdminFeedback();
    showToast("Reply saved!");
  } catch (error) {
    console.error("Error saving reply:", error);
  }
}

// Add Message
async function addMessageToFirebase(text) {
  try {
    const message = {
      sender: "Customer",
      text,
      time: new Date().toLocaleTimeString(),
      reply: "",
    };
    const docRef = await addDoc(collection(db, "messages"), message);
    message.id = docRef.id;
    communityMessages.push(message);
    renderCommunityMessages();
    showToast("Message sent!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Add Order
async function addOrderToFirebase(order) {
  try {
    await addDoc(collection(db, "orders"), order);
    orders.push(order);
    renderOrders();
  } catch (error) {
    console.error("Error placing order:", error);
  }
}

// Update Order Status
async function updateOrderStatus(orderId, status) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) orders[index].status = status;
    renderOrders();
    showToast("Order status updated!");
  } catch (error) {
    console.error("Error updating order:", error);
  }
}

// ============ UI FUNCTIONS ============

function showToast(message) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = message;
  toast.style.opacity = "1";
  setTimeout(() => (toast.style.opacity = "0"), 1800);
}

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById("cartCountBadge");
  if (badge) badge.innerText = totalItems;
  localStorage.setItem("cr7_cart", JSON.stringify(cart));
}

// Render Products (Customer View)
function renderProducts(filterCategory = null) {
  let filtered =
    filterCategory && filterCategory !== "all"
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
      <img class="product-img" src="${product.image || "https://placehold.co/400x500/1a1a1a/ffffff?text=Product"}" alt="${product.name}">
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
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-id");
      addToCart(id);
    });
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product || product.stock <= 0) {
    showToast("Out of stock!");
    return;
  }

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    if (existing.quantity + 1 > product.stock) {
      showToast("Not enough stock!");
      return;
    }
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

// Checkout
async function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
    const product = products.find((p) => p.id === item.id);
    if (product) {
      const newStock = product.stock - item.quantity;
      await updateProductInFirebase(product.id, { stock: newStock });
    }
  }

  const order = {
    items: cart.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    total: total,
    date: new Date().toLocaleString(),
    status: "Pending",
  };

  await addOrderToFirebase(order);
  cart = [];
  updateCartUI();
  await loadAllData();
  alert("✅ Order placed successfully! Admin will process your order.");
}

// ============ ADMIN FUNCTIONS ============

function renderAdminTable() {
  const body = document.getElementById("adminStockBody");
  if (!body) return;

  body.innerHTML = products
    .map(
      (p) => `
    <tr>
      <td>${p.id.substring(0, 8)}</td>
      <td><input class="edit-name" data-id="${p.id}" value="${p.name}"></td>
      <td><input class="edit-price" data-id="${p.id}" value="${p.price}"></td>
      <td><input class="edit-stock" data-id="${p.id}" value="${p.stock}"></td>
      <td><button class="delete-prod" data-id="${p.id}" style="background:#dc2626;">Delete</button></td>
    </tr>
  `,
    )
    .join("");

  document.querySelectorAll(".edit-name").forEach((i) =>
    i.addEventListener("change", () => {
      updateProductInFirebase(i.dataset.id, { name: i.value });
    }),
  );

  document.querySelectorAll(".edit-price").forEach((i) =>
    i.addEventListener("change", () => {
      updateProductInFirebase(i.dataset.id, { price: parseFloat(i.value) });
    }),
  );

  document.querySelectorAll(".edit-stock").forEach((i) =>
    i.addEventListener("change", () => {
      updateProductInFirebase(i.dataset.id, { stock: parseInt(i.value) });
    }),
  );

  document.querySelectorAll(".delete-prod").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (confirm("Delete this product?"))
        deleteProductFromFirebase(btn.dataset.id);
    }),
  );
}

function addNewProduct() {
  const name = document.getElementById("newProdName").value.trim();
  const price = parseFloat(document.getElementById("newProdPrice").value);
  const stock = parseInt(document.getElementById("newProdStock").value);
  const category = document.getElementById("newProdCat").value;

  if (!name || isNaN(price)) {
    alert("Enter valid name and price");
    return;
  }

  const newProduct = {
    name,
    price,
    category,
    stock: stock || 0,
    image: "https://placehold.co/400x500/1a1a1a/ffffff?text=New",
    tag: "new",
  };

  addProductToFirebase(newProduct);
  document.getElementById("newProdName").value = "";
  document.getElementById("newProdPrice").value = "";
  document.getElementById("newProdStock").value = "";
}

function renderAdminFeedback() {
  const container = document.getElementById("adminFeedbackList");
  if (!container) return;

  if (feedbacks.length === 0) {
    container.innerHTML = "<p>No feedback yet.</p>";
    return;
  }

  container.innerHTML = feedbacks
    .map(
      (fb) => `
    <div style="background:#1a1a1a; padding:12px; border-radius:16px; margin-bottom:12px;">
      <strong>Customer:</strong> ${fb.text}<br>
      <small>${fb.date}</small><br>
      <textarea id="reply_${fb.id}" placeholder="Admin reply..." style="width:100%; margin-top:8px;">${fb.reply || ""}</textarea>
      <button class="save-reply" data-id="${fb.id}">Save Reply</button>
      <div class="admin-reply">${fb.reply ? `<strong>Admin:</strong> ${fb.reply}` : ""}</div>
    </div>
  `,
    )
    .join("");

  document.querySelectorAll(".save-reply").forEach((btn) => {
    btn.addEventListener("click", () => {
      const reply = document.getElementById(`reply_${btn.dataset.id}`).value;
      updateFeedbackReply(btn.dataset.id, reply);
    });
  });
}

function renderOrders() {
  const container = document.getElementById("ordersList");
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  container.innerHTML = orders
    .map(
      (order) => `
    <div style="border:1px solid rgba(255,255,255,0.1); padding:10px; border-radius:12px; margin-bottom:8px;">
      <strong>Order ID:</strong> ${order.id.substring(0, 8)}<br>
      Items: ${order.items.map((it) => `${it.name} x${it.quantity}`).join(", ")}<br>
      Total: $${order.total}<br>
      Status: ${order.status}
      ${order.status !== "Completed" ? `<button class="complete-order" data-id="${order.id}" style="background:#22c55e; margin-top:5px;">✅ Mark Completed</button>` : ""}
    </div>
  `,
    )
    .join("");

  document.querySelectorAll(".complete-order").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateOrderStatus(btn.dataset.id, "Completed"),
    );
  });
}

// Announcements (localStorage for admin announcements)
function postAnnouncement() {
  const text = document.getElementById("announcementText").value.trim();
  if (!text) return;
  announcements.unshift(text);
  localStorage.setItem("cr7_announce", JSON.stringify(announcements));
  renderAnnouncementsList();
  renderAnnouncementBanner();
  showToast("Announcement posted!");
  document.getElementById("announcementText").value = "";
}

function renderAnnouncementsList() {
  const container = document.getElementById("announcementsList");
  if (!container) return;
  container.innerHTML = announcements
    .map(
      (a, i) => `
    <div class="new-drop">📢 ${a} <button class="delete-announce" data-idx="${i}" style="background:#dc2626; padding:2px 10px; float:right;">X</button></div>
  `,
    )
    .join("");

  document.querySelectorAll(".delete-announce").forEach((btn) => {
    btn.addEventListener("click", () => {
      announcements.splice(parseInt(btn.dataset.idx), 1);
      localStorage.setItem("cr7_announce", JSON.stringify(announcements));
      renderAnnouncementsList();
      renderAnnouncementBanner();
    });
  });
}

function renderAnnouncementBanner() {
  const banner = document.getElementById("announcementBanner");
  if (banner && announcements.length) {
    banner.innerHTML = `🔥 ${announcements[0]} 🔥`;
  }
}

// Community Functions
function renderCommunityMessages() {
  const container = document.getElementById("chatMessagesList");
  if (!container) return;

  if (communityMessages.length === 0) {
    container.innerHTML =
      "<div class='chat-msg'>✨ Join the conversation about styles, prices & stock!</div>";
    return;
  }

  container.innerHTML = communityMessages
    .map(
      (msg) => `
    <div class="chat-msg">
      <strong>${msg.sender}:</strong> ${msg.text}<br>
      <small>${msg.time}</small>
      ${msg.reply ? `<div class="admin-reply"><strong>Admin:</strong> ${msg.reply}</div>` : ""}
    </div>
  `,
    )
    .join("");
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  addMessageToFirebase(text);
  input.value = "";
}

function submitFeedback() {
  const text = document.getElementById("feedbackTextArea").value.trim();
  if (!text) {
    showToast("Please write feedback first");
    return;
  }
  addFeedbackToFirebase(text);
  document.getElementById("feedbackTextArea").value = "";
}

// ============ MODE TOGGLING ============
function setMode(admin) {
  const adminPanel = document.getElementById("adminPanel");
  const customerMain = document.getElementById("customerMain");

  if (admin) {
    adminPanel.classList.add("active");
    customerMain.style.display = "none";
    renderAdminTable();
    renderAdminFeedback();
    renderOrders();
    renderAnnouncementsList();
  } else {
    adminPanel.classList.remove("active");
    customerMain.style.display = "block";
    renderProducts();
  }
}

// Modal Functions
function openCommunityModal() {
  document.getElementById("communityModal").classList.add("active");
  renderCommunityMessages();
}

function closeCommunityModal() {
  document.getElementById("communityModal").classList.remove("active");
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
  // Profile dropdown
  const profileWrapper = document.getElementById("profileWrapper");
  const profileIcon = document.getElementById("profileIconBtn");

  profileIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    profileWrapper.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!profileWrapper.contains(e.target))
      profileWrapper.classList.remove("active");
  });

  document
    .getElementById("customerModeBtn")
    .addEventListener("click", () => setMode(false));
  document
    .getElementById("adminModeBtn")
    .addEventListener("click", () => setMode(true));
  document
    .getElementById("viewCommunityBtn")
    .addEventListener("click", openCommunityModal);
  document.getElementById("viewFeedbacksBtn").addEventListener("click", () => {
    alert("⭐ Feedback received by admin!");
  });

  document.getElementById("cartIconBtn").addEventListener("click", () => {
    if (cart.length === 0) alert("Cart is empty!");
    else if (confirm("Place order?")) checkout();
  });

  document.getElementById("newsletterBtn").addEventListener("click", () => {
    const email = document.getElementById("newsletterEmail").value.trim();
    if (email && email.includes("@")) {
      alert("🎉 Subscribed! 15% off code: CR715");
    } else alert("Valid email please");
  });

  document.getElementById("communityNavLink").addEventListener("click", (e) => {
    e.preventDefault();
    openCommunityModal();
  });

  document
    .getElementById("sendChatMsgBtn")
    .addEventListener("click", sendChatMessage);
  document
    .getElementById("submitFeedbackModalBtn")
    .addEventListener("click", submitFeedback);
  document
    .getElementById("closeCommunityBtn")
    .addEventListener("click", closeCommunityModal);
  document.getElementById("communityModal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("communityModal"))
      closeCommunityModal();
  });

  document
    .getElementById("addProductBtn")
    .addEventListener("click", addNewProduct);
  document
    .getElementById("postAnnouncementBtn")
    .addEventListener("click", postAnnouncement);
  document.getElementById("shopNowBtn").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
  });

  // Category filters
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const cat = card.getAttribute("data-cat");
      renderProducts(cat);
    });
  });

  // Navigation
  document.getElementById("navNew").addEventListener("click", (e) => {
    e.preventDefault();
    renderProducts();
  });
  document.getElementById("navShop").addEventListener("click", (e) => {
    e.preventDefault();
    renderProducts();
  });
  document.getElementById("navCollections").addEventListener("click", (e) => {
    e.preventDefault();
    renderProducts();
  });
}

// ============ INITIALIZATION ============
async function init() {
  await loadAllData();
  setupEventListeners();
  setMode(false);

  // Load cart from localStorage
  const savedCart = localStorage.getItem("cr7_cart");
  if (savedCart) cart = JSON.parse(savedCart);
  updateCartUI();
}

init();
