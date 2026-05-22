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

const firebaseConfig = {
  apiKey: "AIzaSyBrXk_ltbvHPqbGnD_tIq8u9iNa_R3Bnlc",
  authDomain: "cr7-clothing-b4d5f.firebaseapp.com",
  projectId: "cr7-clothing-b4d5f",
  storageBucket: "cr7-clothing-b4d5f.firebasestorage.app",
  messagingSenderId: "671815729334",
  appId: "1:671815729334:web:d329c18205262c5221a617",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let cart = [];
let communityMessages = [];
let feedbacks = [];
let announcements = ["🔥 New Summer Collection!"];
let orders = [];

async function loadAllData() {
  try {
    const ps = await getDocs(collection(db, "products"));
    if (!ps.empty) {
      products = ps.docs.map((d) => ({ id: d.id, ...d.data() }));
    } else {
      products = [
        {
          id: "m1",
          name: "Men's Oxford Shirt",
          price: 49,
          category: "men",
          stock: 30,
          type: "shirt",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Shirt",
        },
        {
          id: "m4",
          name: "Cotton Crew Tee",
          price: 19,
          category: "men",
          stock: 50,
          type: "tee",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Tee",
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
          id: "a1",
          name: "Leather Handbag",
          price: 89,
          category: "accessories",
          stock: 20,
          type: "handbag",
          image: "https://placehold.co/400x500/1a1a1a/ffffff?text=Handbag",
        },
      ];
      for (const p of products) await addDoc(collection(db, "products"), p);
    }
    const fb = await getDocs(collection(db, "feedbacks"));
    if (!fb.empty) feedbacks = fb.docs.map((d) => ({ id: d.id, ...d.data() }));
    const ms = await getDocs(collection(db, "messages"));
    if (!ms.empty)
      communityMessages = ms.docs.map((d) => ({ id: d.id, ...d.data() }));
    const os = await getDocs(collection(db, "orders"));
    if (!os.empty) orders = os.docs.map((d) => ({ id: d.id, ...d.data() }));
    const saved = localStorage.getItem("cr7_announce");
    if (saved) announcements = JSON.parse(saved);
    renderProducts();
    renderCommunityMessages();
    renderAdminFeedback();
    renderOrders();
    renderAnnouncements();
    updateCartUI();
  } catch (e) {
    console.log(e);
  }
}

function showToast(msg) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = msg;
  toast.style.opacity = "1";
  setTimeout(() => (toast.style.opacity = "0"), 1800);
}

function updateCartUI() {
  const total = cart.reduce((a, i) => a + i.quantity, 0);
  document.getElementById("cartCountBadge").innerText = total;
  localStorage.setItem("cr7_cart", JSON.stringify(cart));
}

function renderProducts(filter = null) {
  let filtered =
    filter === "all"
      ? [...products].sort(() => Math.random() - 0.5)
      : filter
        ? products.filter((p) => p.category === filter)
        : products;
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = filtered
    .map(
      (p) => `
    <div class="product-card">
      <img class="product-img" src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <div class="product-title">${p.name}</div>
        <div class="product-price">$${p.price}</div>
        <div>📦 Stock: ${p.stock}</div>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `,
    )
    .join("");
  document
    .querySelectorAll(".add-to-cart")
    .forEach((btn) =>
      btn.addEventListener("click", () => addToCart(btn.dataset.id)),
    );
}

function addToCart(id) {
  const p = products.find((p) => p.id === id);
  if (!p || p.stock <= 0) {
    showToast("Out of stock!");
    return;
  }
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    if (existing.quantity + 1 > p.stock) {
      showToast("Not enough stock!");
      return;
    }
    existing.quantity++;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, quantity: 1 });
  }
  updateCartUI();
  showToast(`${p.name} added to cart`);
}

// Cart Modal
function openCartModal() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  renderCartList();
  document.getElementById("cartModal").style.display = "flex";
  showCartOnly();
}

function renderCartList() {
  const container = document.getElementById("cartItemsList");
  if (cart.length === 0) {
    container.innerHTML =
      "<div style='text-align:center;padding:40px;'>Cart empty</div>";
    return;
  }
  let subtotal = 0;
  container.innerHTML = cart
    .map((i) => {
      subtotal += i.price * i.quantity;
      return `<div class="cart-item"><div><div class="cart-item-name">${i.name}</div><div>$${i.price}</div><div class="cart-item-quantity"><button class="qty-minus" data-id="${i.id}">-</button><span>${i.quantity}</span><button class="qty-plus" data-id="${i.id}">+</button></div></div><button class="cart-remove" data-id="${i.id}">🗑️</button></div>`;
    })
    .join("");
  document.getElementById("cartSubtotal").innerHTML = `$${subtotal}`;
  document.getElementById("cartGrandTotal").innerHTML = `$${subtotal}`;
  document
    .querySelectorAll(".qty-minus")
    .forEach((b) =>
      b.addEventListener("click", () => updateQty(b.dataset.id, -1)),
    );
  document
    .querySelectorAll(".qty-plus")
    .forEach((b) =>
      b.addEventListener("click", () => updateQty(b.dataset.id, 1)),
    );
  document
    .querySelectorAll(".cart-remove")
    .forEach((b) =>
      b.addEventListener("click", () => removeFromCart(b.dataset.id)),
    );
}

function updateQty(id, change) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = newQty;
      updateCartUI();
      renderCartList();
    }
  }
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCartUI();
  renderCartList();
  if (cart.length === 0)
    document.getElementById("cartModal").style.display = "none";
}

function showCartOnly() {
  document.getElementById("cartItemsList").style.display = "block";
  document.getElementById("deliverySection").style.display = "none";
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("orderSuccessAnim").style.display = "none";
}

function showDelivery() {
  document.getElementById("cartItemsList").style.display = "none";
  document.getElementById("deliverySection").style.display = "block";
}
function showPayment() {
  document.getElementById("deliverySection").style.display = "none";
  document.getElementById("paymentSection").style.display = "block";
}
async function placeOrder() {
  console.log("🔥 placeOrder STARTED");

  const name = document.getElementById("deliveryName")?.value.trim();
  const email = document.getElementById("deliveryEmail")?.value.trim();
  const phone = document.getElementById("deliveryPhone")?.value.trim();
  const addr = document.getElementById("deliveryAddress")?.value.trim();
  const notes = document.getElementById("deliveryNotes")?.value.trim();

  if (!name || !email || !phone || !addr) {
    alert("Please fill all delivery details");
    return;
  }

  console.log("✅ Delivery details validated");

  const orderBtn = document.getElementById("placeOrderFinalBtn");
  const originalText = orderBtn.textContent;
  orderBtn.textContent = "⏳ Placing Order...";
  orderBtn.disabled = true;

  // Calculate total and update stock
  let total = 0;
  console.log("📦 Cart items:", cart.length);

  for (const item of cart) {
    total += item.price * item.quantity;
    const prod = products.find((p) => p.id === item.id);
    if (prod) {
      prod.stock -= item.quantity;
      try {
        await updateDoc(doc(db, "products", prod.id), { stock: prod.stock });
        console.log(`✅ Stock updated for ${prod.name}`);
      } catch (err) {
        console.error("❌ Stock update error:", err);
      }
    }
  }

  console.log("💰 Total calculated:", total);

  const orderData = {
    orderId: "ORD" + Date.now(),
    customer: { name, email, phone, address: addr, notes: notes || "" },
    items: cart.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    total: total,
    date: new Date().toLocaleString(),
    timestamp: new Date(),
    status: "pending",
    paymentMethod: "COD",
  };

  console.log("📝 Order data prepared:", orderData);

  try {
    console.log("💾 Saving to Firebase...");
    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("✅ Order saved! Document ID:", docRef.id);

    cart = [];
    updateCartUI();
    localStorage.setItem("cr7_cart", JSON.stringify(cart));
    console.log("🗑️ Cart cleared");

    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("orderSuccessAnim").style.display = "block";
    console.log("✅ Success animation shown");

    orderBtn.textContent = originalText;
    orderBtn.disabled = false;

    setTimeout(() => {
      document.getElementById("cartModal").style.display = "none";
      document.getElementById("orderSuccessAnim").style.display = "none";
      showCartOnly();
      document.getElementById("deliveryName").value = "";
      document.getElementById("deliveryEmail").value = "";
      document.getElementById("deliveryPhone").value = "";
      document.getElementById("deliveryAddress").value = "";
      document.getElementById("deliveryNotes").value = "";
      console.log("🔄 Modal closed and form reset");
    }, 3000);
  } catch (error) {
    console.error("❌❌❌ ORDER ERROR:", error);
    alert("Failed to place order: " + error.message);
    orderBtn.textContent = originalText;
    orderBtn.disabled = false;
  }
}

// Subcategories
function setupSubcats() {
  document
    .querySelector('.category-card[data-cat="men"]')
    ?.addEventListener("click", () => toggleSub("subMen"));
  document
    .querySelector('.category-card[data-cat="women"]')
    ?.addEventListener("click", () => toggleSub("subWomen"));
  document
    .querySelector('.category-card[data-cat="accessories"]')
    ?.addEventListener("click", () => toggleSub("subAccessories"));
  document
    .querySelector('.category-card[data-cat="all"]')
    ?.addEventListener("click", () => {
      hideAllSubs();
      renderProducts("all");
    });
  document.querySelectorAll(".subcat-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat,
        type = btn.dataset.type;
      const filtered =
        type === "all"
          ? products.filter((p) => p.category === cat)
          : products.filter((p) => p.category === cat && p.type === type);
      document.getElementById("productGrid").innerHTML = filtered
        .map(
          (p) =>
            `<div class="product-card"><img src="${p.image}"><div class="product-info"><div class="product-title">${p.name}</div><div class="product-price">$${p.price}</div><button class="add-to-cart" data-id="${p.id}">Add to Cart</button></div></div>`,
        )
        .join("");
      document
        .querySelectorAll(".add-to-cart")
        .forEach((b) =>
          b.addEventListener("click", () => addToCart(b.dataset.id)),
        );
      hideAllSubs();
    }),
  );
}
function toggleSub(id) {
  hideAllSubs();
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === "none" ? "flex" : "none";
}
function hideAllSubs() {
  ["subMen", "subWomen", "subAccessories"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

// Admin functions
function renderAdminTable() {
  const body = document.getElementById("adminStockBody");
  if (!body) return;
  body.innerHTML = products
    .map(
      (p) =>
        `<tr><td>${p.id.substring(0, 6)}</td><td><input class="edit-name" data-id="${p.id}" value="${p.name}"></td><td><input class="edit-price" data-id="${p.id}" value="${p.price}"></td><td><input class="edit-stock" data-id="${p.id}" value="${p.stock}"></td><td><button class="del-prod" data-id="${p.id}">Delete</button></td></tr>`,
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
  document
    .querySelectorAll(".del-prod")
    .forEach((b) =>
      b.addEventListener("click", () =>
        deleteDoc(doc(db, "products", b.dataset.id)),
      ),
    );
}
function addNewProd() {
  const name = document.getElementById("newProdName").value.trim();
  const price = parseFloat(document.getElementById("newProdPrice").value);
  const stock = parseInt(document.getElementById("newProdStock").value);
  const cat = document.getElementById("newProdCat").value;
  if (!name) return;
  addDoc(collection(db, "products"), {
    name,
    price,
    category: cat,
    stock,
    type: "general",
    image: "https://placehold.co/400x500/1a1a1a/ffffff?text=New",
  });
}
function renderAdminFeedback() {
  const cont = document.getElementById("adminFeedbackList");
  if (cont)
    cont.innerHTML = feedbacks
      .map(
        (f) =>
          `<div><strong>${f.text}</strong><br><small>${f.date}</small><br><textarea id="reply_${f.id}">${f.reply || ""}</textarea><button class="save-reply" data-id="${f.id}">Reply</button></div>`,
      )
      .join("");
  document.querySelectorAll(".save-reply").forEach((b) =>
    b.addEventListener("click", () =>
      updateDoc(doc(db, "feedbacks", b.dataset.id), {
        reply: document.getElementById(`reply_${b.dataset.id}`).value,
      }),
    ),
  );
}
function renderOrders() {
  const cont = document.getElementById("ordersList");
  if (cont)
    cont.innerHTML = orders
      .map(
        (o) =>
          `<div><strong>Order ${o.id}</strong><br>Items: ${o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}<br>Total: $${o.total}<br>Status: ${o.status}</div>`,
      )
      .join("");
}
function renderAnnouncements() {
  const cont = document.getElementById("announcementsList");
  if (cont)
    cont.innerHTML = announcements
      .map(
        (a, i) =>
          `<div>📢 ${a} <button class="del-announce" data-idx="${i}">X</button></div>`,
      )
      .join("");
  document.querySelectorAll(".del-announce").forEach((b) =>
    b.addEventListener("click", () => {
      announcements.splice(parseInt(b.dataset.idx), 1);
      localStorage.setItem("cr7_announce", JSON.stringify(announcements));
      renderAnnouncements();
      document.getElementById("announcementBanner").innerHTML = announcements[0]
        ? `🔥 ${announcements[0]} 🔥`
        : "";
    }),
  );
  document.getElementById("announcementBanner").innerHTML = announcements[0]
    ? `🔥 ${announcements[0]} 🔥`
    : "";
}
function postAnnounce() {
  const txt = document.getElementById("announcementText").value.trim();
  if (!txt) return;
  announcements.unshift(txt);
  localStorage.setItem("cr7_announce", JSON.stringify(announcements));
  renderAnnouncements();
  document.getElementById("announcementText").value = "";
}
function renderCommunityMessages() {
  const cont = document.getElementById("chatMessagesList");
  if (cont)
    cont.innerHTML = communityMessages
      .map(
        (m) =>
          `<div><strong>${m.sender}:</strong> ${m.text}<br><small>${m.time}</small></div>`,
      )
      .join("");
}
function sendMessage() {
  const inp = document.getElementById("chatInput");
  if (!inp.value.trim()) return;
  addDoc(collection(db, "messages"), {
    sender: "Customer",
    text: inp.value,
    time: new Date().toLocaleTimeString(),
  });
  inp.value = "";
}
function submitFeedback() {
  const txt = document.getElementById("feedbackTextArea").value.trim();
  if (!txt) return;
  addDoc(collection(db, "feedbacks"), {
    text: txt,
    date: new Date().toLocaleString(),
    reply: "",
  });
  document.getElementById("feedbackTextArea").value = "";
}
function setMode(admin) {
  const panel = document.getElementById("adminPanel"),
    main = document.getElementById("customerMain"),
    cont = document.getElementById("adminPanelContainer");
  if (admin) {
    panel.classList.add("active");
    main.style.display = "none";
    if (cont) cont.style.display = "block";
    renderAdminTable();
    renderAdminFeedback();
    renderOrders();
  } else {
    panel.classList.remove("active");
    main.style.display = "block";
    if (cont) cont.style.display = "none";
    renderProducts();
  }
}

function setupEvents() {
  // Admin Dashboard button
  document
    .getElementById("adminDashboardLink")
    ?.addEventListener("click", () => {
      window.location.href = "admin-dashboard.html";
    });

  // Cart button
  document
    .getElementById("cartIconBtn")
    ?.addEventListener("click", openCartModal);

  // Cart modal close
  document.querySelector(".cart-modal-close")?.addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
  });

  // Continue shopping button
  document
    .getElementById("continueShoppingBtn")
    ?.addEventListener("click", () => {
      document.getElementById("cartModal").style.display = "none";
    });

  // Proceed to delivery
  const proceedBtn = document.getElementById("proceedToDeliveryBtn");
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Cart is empty!");
        return;
      }
      const isLoggedIn = localStorage.getItem("customerLoggedIn") === "true";
      if (!isLoggedIn) {
        localStorage.setItem("returnUrl", window.location.href);
        window.location.href = "customer-login.html";
      } else {
        showDelivery();
      }
    });
  }

  // Back to cart
  document
    .getElementById("backToCartBtn")
    ?.addEventListener("click", showCartOnly);

  // Proceed to payment
  document
    .getElementById("proceedToPaymentBtn")
    ?.addEventListener("click", showPayment);

  // Back to delivery
  document
    .getElementById("backToDeliveryBtn")
    ?.addEventListener("click", showDelivery);

  // Place order
  document
    .getElementById("placeOrderFinalBtn")
    ?.addEventListener("click", () => {
      if (
        document.querySelector("input[name='paymentMethod']:checked")?.value ===
        "cod"
      ) {
        placeOrder();
      } else {
        alert("Online payment coming soon!");
      }
    });

  // Close success button
  document.getElementById("closeSuccessBtn")?.addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
  });

  // Payment method change
  document.querySelectorAll("input[name='paymentMethod']").forEach((r) =>
    r.addEventListener("change", () => {
      document.getElementById("onlinePaymentMsg").style.display =
        r.value === "online" ? "block" : "none";
    }),
  );

  // Search button
  document.getElementById("searchBtn")?.addEventListener("click", () => {
    document.getElementById("searchModal").style.display = "flex";
  });

  // Close search
  document.getElementById("closeSearchBtn")?.addEventListener("click", () => {
    document.getElementById("searchModal").style.display = "none";
  });

  // Search input
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter((p) => p.name.toLowerCase().includes(q));
    const res = document.getElementById("searchResults");
    if (filtered.length === 0) {
      res.innerHTML = "<div>No results</div>";
    } else {
      res.innerHTML = filtered
        .map(
          (p) =>
            `<div class="search-result-item" data-id="${p.id}"><img src="${p.image}" style="width:40px;"><span>${p.name}</span><span>$${p.price}</span></div>`,
        )
        .join("");
      document
        .querySelectorAll(".search-result-item")
        .forEach((el) =>
          el.addEventListener("click", () => addToCart(el.dataset.id)),
        );
    }
  });

  // Add product button (admin)
  document
    .getElementById("addProductBtn")
    ?.addEventListener("click", addNewProd);

  // Post announcement
  document
    .getElementById("postAnnouncementBtn")
    ?.addEventListener("click", postAnnounce);

  // Send chat message
  document
    .getElementById("sendChatMsgBtn")
    ?.addEventListener("click", sendMessage);

  // Submit feedback
  document
    .getElementById("submitFeedbackModalBtn")
    ?.addEventListener("click", submitFeedback);

  // Community modal
  document.getElementById("communityNavLink")?.addEventListener("click", () => {
    document.getElementById("communityModal").classList.add("active");
  });

  // Close community modal
  document
    .getElementById("closeCommunityBtn")
    ?.addEventListener("click", () => {
      document.getElementById("communityModal").classList.remove("active");
    });

  // Customer mode (remove if not needed)
  document
    .getElementById("customerModeBtn")
    ?.addEventListener("click", () => setMode(false));

  // Admin mode (remove if not needed)
  document
    .getElementById("adminModeBtn")
    ?.addEventListener("click", () => setMode(true));

  // Profile icon toggle
  document.getElementById("profileIconBtn")?.addEventListener("click", () => {
    document.getElementById("profileWrapper").classList.toggle("active");
  });

  // Close profile dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-wrapper")) {
      document.getElementById("profileWrapper")?.classList.remove("active");
    }
  });

  // Newsletter subscription
  document.getElementById("newsletterBtn")?.addEventListener("click", () => {
    const email = document.getElementById("newsletterEmail").value;
    if (email.includes("@")) {
      alert("Subscribed!");
    } else {
      alert("Valid email please");
    }
  });

  // ========== SINGLE LOGOUT BUTTON ==========
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    // Clear all sessions
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminUid");
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("returnUrl");

    alert("Logged out successfully");
    window.location.reload();
  });
}

async function init() {
  await loadAllData();
  setupEvents();
  setupSubcats();
  const savedCart = localStorage.getItem("cr7_cart");
  if (savedCart) cart = JSON.parse(savedCart);
  updateCartUI();
  document.getElementById("adminPanel")?.classList.remove("active");
  if (document.getElementById("adminPanelContainer"))
    document.getElementById("adminPanelContainer").style.display = "none";
  document.getElementById("customerMain").style.display = "block";
}

// Check if customer is logged in
function isCustomerLoggedIn() {
  const user = localStorage.getItem("customerLoggedIn");
  const userEmail = localStorage.getItem("customerEmail");
  return user === "true" && userEmail;
}

// Save customer login info
function setCustomerLogin(userId, email) {
  localStorage.setItem("customerLoggedIn", "true");
  localStorage.setItem("customerId", userId);
  localStorage.setItem("customerEmail", email);
}

// Clear customer login on logout
function clearCustomerLogin() {
  localStorage.removeItem("customerLoggedIn");
  localStorage.removeItem("customerId");
  localStorage.removeItem("customerEmail");
}

// Show login/signup prompt before proceeding to delivery
function showAuthPrompt() {
  const modal = document.createElement("div");
  modal.className = "auth-prompt-modal";
  modal.innerHTML = `
    <div class="auth-prompt-content">
      <h3>🔐 Login Required</h3>
      <p>Please login or create an account to continue with your order.</p>
      <div class="auth-prompt-buttons">
        <a href="customer-login.html" class="auth-prompt-btn login-btn">Login</a>
        <a href="customer-signup.html" class="auth-prompt-btn signup-btn">Create Account</a>
      </div>
      <button class="auth-prompt-close">Continue as Guest</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".auth-prompt-close").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}
init();
