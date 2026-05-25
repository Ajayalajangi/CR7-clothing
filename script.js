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

// ============ LOAD PRODUCTS FROM FIREBASE ============
async function loadAllData() {
  try {
    console.log("🟢 Loading products from Firebase...");

    // Load Products
    const productsSnapshot = await getDocs(collection(db, "products"));

    console.log("Products found:", productsSnapshot.size);

    if (!productsSnapshot.empty) {
      products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("✅ Loaded", products.length, "products");
    } else {
      console.log("❌ No products found in database");
      products = [];
    }

    // Load other data
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

    // Render everything
    renderProducts();
    renderCommunityMessages();
    renderAdminFeedback();
    renderOrders();
    renderAnnouncements();
    updateCartUI();
  } catch (error) {
    console.error("🔴 Error loading data:", error);
    showToast("Error connecting to database");
  }
}

// ============ RENDER PRODUCTS ============
function renderProducts(filterCategory = null) {
  console.log("Rendering products, count:", products.length);

  let filtered =
    filterCategory === "all"
      ? [...products].sort(() => Math.random() - 0.5)
      : filterCategory && filterCategory !== "all"
        ? products.filter((p) => p.category === filterCategory)
        : products;

  const grid = document.getElementById("productGrid");
  if (!grid) {
    console.log("productGrid element not found!");
    return;
  }

  if (filtered.length === 0) {
    grid.innerHTML =
      "<div style='text-align:center; padding:40px;'>🛍️ No products found. Admin please add products.</div>";
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
        <div style="font-size:0.75rem; color:#888;">📦 Stock: ${product.stock || 0}</div>
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

// ============ CART FUNCTIONS ============
function showToast(msg) {
  const toast = document.getElementById("toastMsg");
  if (toast) {
    toast.textContent = msg;
    toast.style.opacity = "1";
    setTimeout(() => (toast.style.opacity = "0"), 1800);
  }
}

function updateCartUI() {
  const total = cart.reduce((a, i) => a + i.quantity, 0);
  const badge = document.getElementById("cartCountBadge");
  if (badge) badge.innerText = total;
  localStorage.setItem("cr7_cart", JSON.stringify(cart));
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product || product.stock <= 0) {
    showToast("Out of stock!");
    return;
  }
  const existing = cart.find((i) => i.id === id);
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

// ============ PAYMENT FUNCTIONS ============
let razorpayKeyId = "YOUR_RAZORPAY_KEY_ID"; // Replace with your actual Key ID

async function processPayment() {
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked',
  )?.value;

  // Get order total
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
  }

  if (total <= 0) {
    alert("Cart is empty!");
    return;
  }

  // Show loading
  const payBtn = document.getElementById("processPaymentBtn");
  payBtn.textContent = "⏳ Processing...";
  payBtn.disabled = true;

  // Create order on backend
  try {
    const orderResponse = await fetch(
      "http://localhost:5000/api/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
        }),
      },
    );

    const order = await orderResponse.json();

    // Configure Razorpay options
    const options = {
      key: razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name: "CR7 Clothing",
      description: `Order ${order.id}`,
      order_id: order.id,
      handler: function (response) {
        verifyPayment(response, order.id, total);
      },
      prefill: {
        name: document.getElementById("deliveryName")?.value || "",
        email: document.getElementById("deliveryEmail")?.value || "",
        contact: document.getElementById("deliveryPhone")?.value || "",
      },
      theme: {
        color: "#ff7a00",
      },
      modal: {
        ondismiss: function () {
          payBtn.textContent = "Pay Now 💰";
          payBtn.disabled = false;
        },
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    console.error("Payment error:", error);
    showPaymentAnimation("failed");
    payBtn.textContent = "Pay Now 💰";
    payBtn.disabled = false;
  }
}
// ============ RAZORPAY PAYMENT ============
async function processRazorpayPayment(total) {
  try {
    // Get Razorpay Key from server
    const keyResponse = await fetch("http://localhost:5000/api/get-key");
    const { key_id } = await keyResponse.json();

    // Create order
    const orderResponse = await fetch(
      "http://localhost:5000/api/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" }),
      },
    );

    const order = await orderResponse.json();

    const options = {
      key: key_id,
      amount: order.amount,
      currency: order.currency,
      name: "CR7 Clothing",
      description: "Fashion Purchase",
      order_id: order.id,
      handler: async function (response) {
        // Verify payment
        const verifyRes = await fetch(
          "http://localhost:5000/api/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          },
        );

        const result = await verifyRes.json();

        if (result.success) {
          showPaymentSuccessAnimation();
          await saveOrderToFirebase(result.paymentId, total);
          clearCartAfterPayment();
        } else {
          showPaymentFailedAnimation();
        }
      },
      prefill: {
        name: document.getElementById("deliveryName")?.value || "",
        email: document.getElementById("deliveryEmail")?.value || "",
        contact: document.getElementById("deliveryPhone")?.value || "",
      },
      theme: { color: "#ff7a00" },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Payment error:", error);
    showPaymentFailedAnimation();
  }
}

async function verifyPayment(response, orderId, total) {
  const payBtn = document.getElementById("processPaymentBtn");

  try {
    const verifyResponse = await fetch(
      "http://localhost:5000/api/verify-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      },
    );

    const result = await verifyResponse.json();

    if (result.success) {
      // Payment successful - save order
      await saveOrderToFirebase(
        "success",
        orderId,
        total,
        response.razorpay_payment_id,
      );
      showPaymentAnimation("success");
      clearCartAndRedirect();
    } else {
      showPaymentAnimation("failed");
      payBtn.textContent = "Pay Now 💰";
      payBtn.disabled = false;
    }
  } catch (error) {
    console.error("Verification error:", error);
    showPaymentAnimation("failed");
    payBtn.textContent = "Pay Now 💰";
    payBtn.disabled = false;
  }
}

async function saveOrderToFirebase(status, orderId, total, paymentId) {
  const name = document.getElementById("deliveryName")?.value;
  const email = document.getElementById("deliveryEmail")?.value;
  const phone = document.getElementById("deliveryPhone")?.value;
  const address = document.getElementById("deliveryAddress")?.value;

  const orderData = {
    orderId: orderId,
    razorpayPaymentId: paymentId,
    customer: { name, email, phone, address },
    items: cart.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    total: total,
    paymentStatus: status,
    orderStatus: status === "success" ? "confirmed" : "pending",
    date: new Date().toLocaleString(),
    timestamp: new Date(),
  };

  await addDoc(collection(db, "orders"), orderData);

  // Update product stock
  for (const item of cart) {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      product.stock -= item.quantity;
      await updateDoc(doc(db, "products", product.id), {
        stock: product.stock,
      });
    }
  }

  // Clear cart
  cart = [];
  updateCartUI();
  localStorage.setItem("cr7_cart", JSON.stringify(cart));
}

function showPaymentAnimation(status) {
  // Hide all animations
  document.getElementById("paymentSuccessAnim").style.display = "none";
  document.getElementById("paymentFailedAnim").style.display = "none";
  document.getElementById("paymentPendingAnim").style.display = "none";

  // Show the relevant animation
  if (status === "success") {
    document.getElementById("paymentSuccessAnim").style.display = "block";
  } else if (status === "failed") {
    document.getElementById("paymentFailedAnim").style.display = "block";
  } else if (status === "pending") {
    document.getElementById("paymentPendingAnim").style.display = "block";
  }

  // Hide payment section
  document.getElementById("paymentSection").style.display = "none";
}

function clearCartAndRedirect() {
  setTimeout(() => {
    document.getElementById("cartModal").style.display = "none";
    // Reset to home page or show success
    window.location.reload();
  }, 3000);
}

// Update payment method selection to show/hide UPI options
document.querySelectorAll("input[name='paymentMethod']").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const upiOptions = document.getElementById("upiOptions");
    if (upiOptions) {
      upiOptions.style.display = e.target.value === "upi" ? "block" : "none";
    }
  });
});

// Replace the placeOrderFinalBtn event listener
document.getElementById("placeOrderFinalBtn")?.addEventListener("click", () => {
  const paymentMethod = document.querySelector(
    "input[name='paymentMethod']:checked",
  )?.value;
  if (paymentMethod === "cod") {
    placeOrder(); // Your existing COD order function
  } else {
    processPayment(); // New payment function
  }
});

// ============ OTHER FUNCTIONS (keep existing ones) ============
function renderCommunityMessages() {
  const cont = document.getElementById("chatMessagesList");
  if (cont) {
    cont.innerHTML = communityMessages
      .map(
        (m) =>
          `<div><strong>${m.sender}:</strong> ${m.text}<br><small>${m.time}</small></div>`,
      )
      .join("");
  }
}

function renderAdminFeedback() {
  const cont = document.getElementById("adminFeedbackList");
  if (cont) {
    cont.innerHTML = feedbacks
      .map(
        (f) =>
          `<div><strong>${f.text}</strong><br><small>${f.date}</small><br><textarea id="reply_${f.id}">${f.reply || ""}</textarea><button class="save-reply" data-id="${f.id}">Reply</button></div>`,
      )
      .join("");
  }
  document.querySelectorAll(".save-reply").forEach((b) => {
    b.addEventListener("click", () => {
      updateDoc(doc(db, "feedbacks", b.dataset.id), {
        reply: document.getElementById(`reply_${b.dataset.id}`).value,
      });
    });
  });
}

function renderOrders() {
  const cont = document.getElementById("ordersList");
  if (cont) {
    cont.innerHTML = orders
      .map(
        (o) =>
          `<div><strong>Order ${o.id}</strong><br>Items: ${o.items?.map((i) => `${i.name} x${i.quantity}`).join(", ")}<br>Total: $${o.total}<br>Status: ${o.status}</div>`,
      )
      .join("");
  }
}

function renderAnnouncements() {
  const cont = document.getElementById("announcementsList");
  if (cont) {
    cont.innerHTML = announcements
      .map(
        (a, i) =>
          `<div>📢 ${a} <button class="del-announce" data-idx="${i}">X</button></div>`,
      )
      .join("");
  }
  document.querySelectorAll(".del-announce").forEach((b) => {
    b.addEventListener("click", () => {
      announcements.splice(parseInt(b.dataset.idx), 1);
      localStorage.setItem("cr7_announce", JSON.stringify(announcements));
      renderAnnouncements();
    });
  });
  const banner = document.getElementById("announcementBanner");
  if (banner) {
    banner.innerHTML = announcements[0] ? `🔥 ${announcements[0]} 🔥` : "";
  }
}

function sendMessage() {
  const inp = document.getElementById("chatInput");
  if (inp && inp.value.trim()) {
    addDoc(collection(db, "messages"), {
      sender: "Customer",
      text: inp.value,
      time: new Date().toLocaleTimeString(),
    });
    inp.value = "";
  }
}

function submitFeedback() {
  const txt = document.getElementById("feedbackTextArea");
  if (txt && txt.value.trim()) {
    addDoc(collection(db, "feedbacks"), {
      text: txt.value,
      date: new Date().toLocaleString(),
      reply: "",
    });
    txt.value = "";
  }
}

function setMode(admin) {
  const panel = document.getElementById("adminPanel");
  const main = document.getElementById("customerMain");
  const cont = document.getElementById("adminPanelContainer");
  if (admin) {
    if (panel) panel.classList.add("active");
    if (main) main.style.display = "none";
    if (cont) cont.style.display = "block";
  } else {
    if (panel) panel.classList.remove("active");
    if (main) main.style.display = "block";
    if (cont) cont.style.display = "none";
    renderProducts();
  }
}

// ============ EVENT LISTENERS ============
function setupEvents() {
  document.getElementById("cartIconBtn")?.addEventListener("click", () => {
    if (cart.length === 0) alert("Cart is empty!");
    else alert(`Cart has ${cart.length} items`);
  });

  document.getElementById("searchBtn")?.addEventListener("click", () => {
    document.getElementById("searchModal").style.display = "flex";
  });

  document.getElementById("closeSearchBtn")?.addEventListener("click", () => {
    document.getElementById("searchModal").style.display = "none";
  });

  document.getElementById("communityNavLink")?.addEventListener("click", () => {
    document.getElementById("communityModal").classList.add("active");
  });

  document
    .getElementById("closeCommunityBtn")
    ?.addEventListener("click", () => {
      document.getElementById("communityModal").classList.remove("active");
    });

  document
    .getElementById("sendChatMsgBtn")
    ?.addEventListener("click", sendMessage);
  document
    .getElementById("submitFeedbackModalBtn")
    ?.addEventListener("click", submitFeedback);
  document
    .getElementById("adminDashboardLink")
    ?.addEventListener("click", () => {
      window.location.href = "admin-dashboard.html";
    });
}

// ============ SUBCATEGORIES ============
function setupSubcats() {
  document
    .querySelector('.category-card[data-cat="men"]')
    ?.addEventListener("click", () => {
      renderProducts("men");
    });
  document
    .querySelector('.category-card[data-cat="women"]')
    ?.addEventListener("click", () => {
      renderProducts("women");
    });
  document
    .querySelector('.category-card[data-cat="accessories"]')
    ?.addEventListener("click", () => {
      renderProducts("accessories");
    });
  document
    .querySelector('.category-card[data-cat="all"]')
    ?.addEventListener("click", () => {
      renderProducts("all");
    });
}

// ============ INITIALIZE ============
async function init() {
  await loadAllData();
  setupEvents();
  setupSubcats();

  const savedCart = localStorage.getItem("cr7_cart");
  if (savedCart) cart = JSON.parse(savedCart);
  updateCartUI();

  setMode(false);
}

init();
