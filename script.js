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
    // Load Products
    const productsSnapshot = await getDocs(collection(db, "products"));
    if (!productsSnapshot.empty) {
      products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      // Initial products - 48 products
      products = [
        // MENS SECTION (21 products)
        {
          id: "m1",
          name: "Men's Classic Oxford Shirt",
          price: 49,
          category: "men",
          stock: 30,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Shirt",
        },
        {
          id: "m2",
          name: "Men's Linen Casual Shirt",
          price: 45,
          category: "men",
          stock: 25,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Linen+Shirt",
        },
        {
          id: "m3",
          name: "Men's Denim Shirt",
          price: 55,
          category: "men",
          stock: 20,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Denim+Shirt",
        },
        {
          id: "m4",
          name: "Men's Cotton Crew Neck Tee",
          price: 19,
          category: "men",
          stock: 50,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Crew+Tee",
        },
        {
          id: "m5",
          name: "Men's V-Neck T-Shirt",
          price: 22,
          category: "men",
          stock: 45,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+V-Neck+Tee",
        },
        {
          id: "m6",
          name: "Men's Graphic Printed Tee",
          price: 25,
          category: "men",
          stock: 40,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Graphic+Tee",
        },
        {
          id: "m7",
          name: "Men's Slim Fit Jeans",
          price: 59,
          category: "men",
          stock: 35,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Slim+Jeans",
        },
        {
          id: "m8",
          name: "Men's Relaxed Fit Jeans",
          price: 55,
          category: "men",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Relaxed+Jeans",
        },
        {
          id: "m9",
          name: "Men's Ripped Jeans",
          price: 65,
          category: "men",
          stock: 25,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Ripped+Jeans",
        },
        {
          id: "m10",
          name: "Men's Formal Trousers",
          price: 69,
          category: "men",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Formal+Trouser",
        },
        {
          id: "m11",
          name: "Men's Chino Pants",
          price: 49,
          category: "men",
          stock: 35,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Chino",
        },
        {
          id: "m12",
          name: "Men's Cotton Joggers",
          price: 39,
          category: "men",
          stock: 40,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Joggers",
        },
        {
          id: "m13",
          name: "Men's Fleece Joggers",
          price: 45,
          category: "men",
          stock: 35,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Fleece+Joggers",
        },
        {
          id: "m14",
          name: "Men's Cotton Vest",
          price: 12,
          category: "men",
          stock: 60,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Vest",
        },
        {
          id: "m15",
          name: "Men's Trunks Pack (3)",
          price: 18,
          category: "men",
          stock: 50,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Trunks",
        },
        {
          id: "m16",
          name: "Men's Casual Sneakers",
          price: 79,
          category: "men",
          stock: 25,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Sneakers",
        },
        {
          id: "m17",
          name: "Men's Sports Shoes",
          price: 89,
          category: "men",
          stock: 20,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Sports+Shoes",
        },
        {
          id: "m18",
          name: "Men's Formal Shoes",
          price: 99,
          category: "men",
          stock: 15,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Formal+Shoes",
        },
        {
          id: "m19",
          name: "Men's Oversized Hoodie",
          price: 69,
          category: "men",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Oversized+Hoodie",
        },
        {
          id: "m20",
          name: "Men's Oversized T-Shirt",
          price: 29,
          category: "men",
          stock: 45,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Oversized+Tee",
        },
        {
          id: "m21",
          name: "Men's Slides Sandals",
          price: 24,
          category: "men",
          stock: 40,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Men+Slides",
        },
        // WOMEN SECTION (15 products)
        {
          id: "w1",
          name: "Women's Casual Shirt",
          price: 45,
          category: "women",
          stock: 35,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Shirt",
        },
        {
          id: "w2",
          name: "Women's Cotton Linen Shirt",
          price: 49,
          category: "women",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Linen+Shirt",
        },
        {
          id: "w3",
          name: "Women's Crop Top Tee",
          price: 22,
          category: "women",
          stock: 45,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Crop+Tee",
        },
        {
          id: "w4",
          name: "Women's Oversized Tee",
          price: 28,
          category: "women",
          stock: 40,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Oversized+Tee",
        },
        {
          id: "w5",
          name: "Women's Skinny Jeans",
          price: 55,
          category: "women",
          stock: 35,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Skinny+Jeans",
        },
        {
          id: "w6",
          name: "Women's Boyfriend Jeans",
          price: 59,
          category: "women",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Boyfriend+Jeans",
        },
        {
          id: "w7",
          name: "Women's Palazzo Pants",
          price: 49,
          category: "women",
          stock: 35,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Palazzo",
        },
        {
          id: "w8",
          name: "Women's Formal Trousers",
          price: 59,
          category: "women",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Formal+Trouser",
        },
        {
          id: "w9",
          name: "Women's Jogger Pants",
          price: 39,
          category: "women",
          stock: 40,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Joggers",
        },
        {
          id: "w10",
          name: "Women's Casual Sneakers",
          price: 69,
          category: "women",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Sneakers",
        },
        {
          id: "w11",
          name: "Women's Flats",
          price: 45,
          category: "women",
          stock: 35,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Flats",
        },
        {
          id: "w12",
          name: "Women's Heels",
          price: 79,
          category: "women",
          stock: 20,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Heels",
        },
        {
          id: "w13",
          name: "Women's Oversized Sweater",
          price: 59,
          category: "women",
          stock: 35,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Oversized+Sweater",
        },
        {
          id: "w14",
          name: "Women's Oversized Hoodie",
          price: 65,
          category: "women",
          stock: 30,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Oversized+Hoodie",
        },
        {
          id: "w15",
          name: "Women's Slides Sandals",
          price: 22,
          category: "women",
          stock: 45,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Women+Slides",
        },
        // ACCESSORIES SECTION (12 products)
        {
          id: "a1",
          name: "Premium Leather Handbag",
          price: 89,
          category: "accessories",
          stock: 20,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Handbag",
        },
        {
          id: "a2",
          name: "Canvas Tote Bag",
          price: 35,
          category: "accessories",
          stock: 40,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Tote+Bag",
        },
        {
          id: "a3",
          name: "Smart Watch",
          price: 129,
          category: "accessories",
          stock: 25,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Smart+Watch",
        },
        {
          id: "a4",
          name: "Classic Analog Watch",
          price: 79,
          category: "accessories",
          stock: 30,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Analog+Watch",
        },
        {
          id: "a5",
          name: "Silver Ring",
          price: 29,
          category: "accessories",
          stock: 50,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Silver+Ring",
        },
        {
          id: "a6",
          name: "Gold Plated Ring",
          price: 45,
          category: "accessories",
          stock: 40,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Gold+Ring",
        },
        {
          id: "a7",
          name: "Cotton Cap",
          price: 19,
          category: "accessories",
          stock: 60,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Cap",
        },
        {
          id: "a8",
          name: "Woolen Beanie",
          price: 22,
          category: "accessories",
          stock: 45,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Beanie",
        },
        {
          id: "a9",
          name: "Blue Light Glasses",
          price: 39,
          category: "accessories",
          stock: 35,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Blue+Light+Glasses",
        },
        {
          id: "a10",
          name: "Sunglasses UV Protected",
          price: 49,
          category: "accessories",
          stock: 30,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Sunglasses",
        },
        {
          id: "a11",
          name: "Leather Wallet",
          price: 29,
          category: "accessories",
          stock: 50,
          image:
            "https://placehold.co/400x500/1a1a1a/ffffff?text=Leather+Wallet",
        },
        {
          id: "a12",
          name: "Minimalist Card Holder",
          price: 19,
          category: "accessories",
          stock: 55,
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Card+Holder",
        },
      ];

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
    showToast("Error connecting to database.");
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

function showOrderModal() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  document.getElementById("orderModal").style.display = "flex";
}

async function placeOrderWithDetails() {
  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

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
    notes: document.getElementById("orderNotes").value,
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

  document.getElementById("orderForm").style.display = "none";
  document.getElementById("orderSuccess").style.display = "block";
  cart = [];
  updateCartUI();

  setTimeout(() => {
    document.getElementById("orderModal").style.display = "none";
    document.getElementById("orderForm").reset();
    document.getElementById("orderForm").style.display = "block";
    document.getElementById("orderSuccess").style.display = "none";
  }, 2000);
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

  document
    .querySelectorAll(".edit-name")
    .forEach((i) =>
      i.addEventListener("change", () =>
        updateDoc(doc(db, "products", i.dataset.id), { name: i.value }),
      ),
    );
  document.querySelectorAll(".edit-price").forEach((i) =>
    i.addEventListener("change", () =>
      updateDoc(doc(db, "products", i.dataset.id), {
        price: parseFloat(i.value),
      }),
    ),
  );
  document.querySelectorAll(".edit-stock").forEach((i) =>
    i.addEventListener("change", () =>
      updateDoc(doc(db, "products", i.dataset.id), {
        stock: parseInt(i.value),
      }),
    ),
  );
  document.querySelectorAll(".delete-prod").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (confirm("Delete this product?"))
        deleteDoc(doc(db, "products", btn.dataset.id));
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

  addDoc(collection(db, "products"), {
    name,
    price,
    category,
    stock: stock || 0,
    image: "https://placehold.co/400x500/1a1a1a/ffffff?text=New",
  });

  document.getElementById("newProdName").value = "";
  document.getElementById("newProdPrice").value = "";
  document.getElementById("newProdStock").value = "";
  showToast("Product added!");
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
    <div style="background:#f5f5f5; padding:12px; border-radius:16px; margin-bottom:12px;">
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
      updateDoc(doc(db, "feedbacks", btn.dataset.id), { reply });
      showToast("Reply saved!");
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
    <div style="border:1px solid #ddd; padding:10px; border-radius:12px; margin-bottom:8px;">
      <strong>Order ID:</strong> ${order.id.substring(0, 8)}<br>
      Customer: ${order.customer?.name || "N/A"}<br>
      Items: ${order.items.map((it) => `${it.name} x${it.quantity}`).join(", ")}<br>
      Total: $${order.total}<br>
      Status: ${order.status}
    </div>
  `,
    )
    .join("");
}

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
  if (banner && announcements.length)
    banner.innerHTML = `🔥 ${announcements[0]} 🔥`;
}

function renderCommunityMessages() {
  const container = document.getElementById("chatMessagesList");
  if (!container) return;
  if (communityMessages.length === 0) {
    container.innerHTML =
      "<div class='chat-msg'>✨ Join the conversation!</div>";
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
  addDoc(collection(db, "messages"), {
    sender: "Customer",
    text,
    time: new Date().toLocaleTimeString(),
    reply: "",
  });
  input.value = "";
}

function submitFeedback() {
  const text = document.getElementById("feedbackTextArea").value.trim();
  if (!text) {
    showToast("Please write feedback first");
    return;
  }
  addDoc(collection(db, "feedbacks"), {
    text,
    date: new Date().toLocaleString(),
    reply: "",
  });
  document.getElementById("feedbackTextArea").value = "";
  showToast("Feedback submitted!");
}

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

function openCommunityModal() {
  document.getElementById("communityModal").classList.add("active");
  renderCommunityMessages();
}

function closeCommunityModal() {
  document.getElementById("communityModal").classList.remove("active");
}

// ============ SEARCH FUNCTIONALITY ============
let searchModal = document.getElementById("searchModal");
let searchInput = document.getElementById("searchInput");
let searchResults = document.getElementById("searchResults");
let noResults = document.getElementById("noResults");

if (document.getElementById("searchBtn")) {
  document.getElementById("searchBtn").addEventListener("click", () => {
    if (searchModal) searchModal.style.display = "flex";
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 100);
  });
}

if (document.getElementById("closeSearchBtn")) {
  document.getElementById("closeSearchBtn").addEventListener("click", () => {
    if (searchModal) searchModal.style.display = "none";
    if (searchInput) searchInput.value = "";
    if (searchResults) searchResults.innerHTML = "";
    if (noResults) noResults.style.display = "none";
  });
}

if (searchModal) {
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) {
      searchModal.style.display = "none";
      if (searchInput) searchInput.value = "";
    }
  });
}

function performSearch() {
  if (!searchInput) return;
  let query = searchInput.value.trim().toLowerCase();
  if (query === "") {
    if (searchResults) searchResults.innerHTML = "";
    if (noResults) noResults.style.display = "none";
    return;
  }

  let filtered = products.filter((product) =>
    product.name.toLowerCase().includes(query),
  );

  if (filtered.length === 0) {
    if (searchResults) searchResults.innerHTML = "";
    if (noResults) noResults.style.display = "block";
  } else {
    if (noResults) noResults.style.display = "none";
    if (searchResults) {
      searchResults.innerHTML = filtered
        .map(
          (product) => `
        <div class="search-result-item" data-id="${product.id}">
          <img class="search-result-img" src="${product.image}" alt="${product.name}">
          <div class="search-result-info">
            <div class="search-result-name">${product.name}</div>
            <div class="search-result-price">$${product.price}</div>
          </div>
          <button class="add-to-cart-search" data-id="${product.id}">Add to Cart</button>
        </div>
      `,
        )
        .join("");

      document.querySelectorAll(".add-to-cart-search").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          addToCart(btn.getAttribute("data-id"));
          showToast("Added to cart!");
        });
      });
    }
  }
}

if (searchInput) {
  searchInput.addEventListener("input", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
  const profileWrapper = document.getElementById("profileWrapper");
  const profileIcon = document.getElementById("profileIconBtn");
  if (profileIcon) {
    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (profileWrapper) profileWrapper.classList.toggle("active");
    });
  }
  document.addEventListener("click", (e) => {
    if (profileWrapper && !profileWrapper.contains(e.target))
      profileWrapper.classList.remove("active");
  });

  document
    .getElementById("customerModeBtn")
    ?.addEventListener("click", () => setMode(false));
  document
    .getElementById("adminModeBtn")
    ?.addEventListener("click", () => setMode(true));
  document
    .getElementById("viewCommunityBtn")
    ?.addEventListener("click", openCommunityModal);
  document
    .getElementById("viewFeedbacksBtn")
    ?.addEventListener("click", () => alert("⭐ Feedback received by admin!"));
  document
    .getElementById("cartIconBtn")
    ?.addEventListener("click", showOrderModal);
  document
    .getElementById("closeCommunityBtn")
    ?.addEventListener("click", closeCommunityModal);
  document.getElementById("communityModal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("communityModal"))
      closeCommunityModal();
  });
  document
    .querySelector(".order-modal-close")
    ?.addEventListener("click", () => {
      document.getElementById("orderModal").style.display = "none";
    });
  document.getElementById("orderForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    placeOrderWithDetails();
  });
  document.getElementById("newsletterBtn")?.addEventListener("click", () => {
    const email = document.getElementById("newsletterEmail").value.trim();
    if (email && email.includes("@"))
      alert("🎉 Subscribed! 15% off code: CR715");
    else alert("Valid email please");
  });
  document
    .getElementById("communityNavLink")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      openCommunityModal();
    });
  document
    .getElementById("sendChatMsgBtn")
    ?.addEventListener("click", sendChatMessage);
  document
    .getElementById("submitFeedbackModalBtn")
    ?.addEventListener("click", submitFeedback);
  document
    .getElementById("addProductBtn")
    ?.addEventListener("click", addNewProduct);
  document
    .getElementById("postAnnouncementBtn")
    ?.addEventListener("click", postAnnouncement);
  document.getElementById("shopNowBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".products")?.scrollIntoView({ behavior: "smooth" });
  });
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const cat = card.getAttribute("data-cat");
      renderProducts(cat);
    });
  });
  document.getElementById("navNew")?.addEventListener("click", (e) => {
    e.preventDefault();
    renderProducts();
  });
  document.getElementById("navShop")?.addEventListener("click", (e) => {
    e.preventDefault();
    renderProducts();
  });
  document.getElementById("navCollections")?.addEventListener("click", (e) => {
    e.preventDefault();
    renderProducts();
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
}

init();
