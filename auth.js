// Import Firebase services
import {
  auth,
  db,
  isAdmin,
  getUserRole,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updatePassword,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  orderBy,
  Timestamp,
} from "./firebase-config.js";

// ============ CUSTOMER AUTHENTICATION ============

// Customer Signup
async function customerSignup(fullName, email, phone, password) {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userId = userCredential.user.uid;

    // Store customer data in Firestore
    await setDoc(doc(db, "customers", userId), {
      fullName: fullName,
      email: email,
      phone: phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: [],
      orders: [],
      role: "customer",
    });

    return { success: true, userId: userId };
  } catch (error) {
    console.error("Signup error:", error);
    let message = "Signup failed";
    if (error.code === "auth/email-already-in-use") {
      message = "Email already registered";
    } else if (error.code === "auth/weak-password") {
      message = "Password should be at least 6 characters";
    }
    return { success: false, message: message };
  }
}

// Customer Login (Email or Phone)
async function customerLogin(identifier, password) {
  try {
    let email = identifier;

    // If identifier is phone number, find associated email
    if (identifier.includes("@") === false) {
      const customersRef = collection(db, "customers");
      const q = query(customersRef, where("phone", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: "Invalid phone number or password" };
      }

      const customerDoc = querySnapshot.docs[0];
      email = customerDoc.data().email;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userId = userCredential.user.uid;

    // Check if user is admin
    const adminDoc = await getDoc(doc(db, "admins", userId));
    const isAdminUser = adminDoc.exists() && adminDoc.data().isAdmin === true;

    return {
      success: true,
      userId: userId,
      isAdmin: isAdminUser,
      role: isAdminUser ? "admin" : "customer",
    };
  } catch (error) {
    console.error("Login error:", error);
    let message = "Invalid email/phone or password";
    if (error.code === "auth/user-not-found") {
      message = "Account not found";
    } else if (error.code === "auth/wrong-password") {
      message = "Wrong password";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email format";
    }
    return { success: false, message: message };
  }
}

// Send OTP for password reset (via email)
async function sendResetOTP(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Reset link sent to your email" };
  } catch (error) {
    console.error("Reset error:", error);
    let message = "Failed to send reset link";
    if (error.code === "auth/user-not-found") {
      message = "No account found with this email";
    }
    return { success: false, message: message };
  }
}

// Reset Password (after OTP verification)
async function resetPassword(email, newPassword) {
  // Note: Firebase handles password reset via email link
  // This function would be called after user clicks the reset link
  // For security, we redirect to Firebase's reset page
  await sendPasswordResetEmail(auth, email);
  return { success: true, message: "Password reset email sent" };
}

// Get Customer Profile
async function getCustomerProfile(userId) {
  try {
    const docRef = doc(db, "customers", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    }
    return { success: false, message: "Profile not found" };
  } catch (error) {
    console.error("Profile error:", error);
    return { success: false, message: "Failed to load profile" };
  }
}

// Update Customer Profile
async function updateCustomerProfile(userId, updates) {
  try {
    const docRef = doc(db, "customers", userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return { success: true, message: "Profile updated" };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

// Place Order (Customer must be logged in)
async function placeOrder(userId, cartItems, total, address, paymentMethod) {
  try {
    // Get customer details
    const customerDoc = await getDoc(doc(db, "customers", userId));
    const customerData = customerDoc.data();

    // Create order
    const orderData = {
      userId: userId,
      customerName: customerData.fullName,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      items: cartItems,
      total: total,
      address: address,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const orderRef = await addDoc(collection(db, "orders"), orderData);

    // Update customer's orders array
    const customerOrders = customerData.orders || [];
    customerOrders.push(orderRef.id);
    await updateDoc(doc(db, "customers", userId), { orders: customerOrders });

    // Update product stock
    for (const item of cartItems) {
      const productRef = doc(db, "products", item.id);
      const productDoc = await getDoc(productRef);
      if (productDoc.exists()) {
        const currentStock = productDoc.data().stock;
        await updateDoc(productRef, { stock: currentStock - item.quantity });
      }
    }

    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error("Order error:", error);
    return { success: false, message: "Failed to place order" };
  }
}

// Get Customer Orders
async function getCustomerOrders(userId) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, orders: orders };
  } catch (error) {
    console.error("Orders error:", error);
    return { success: false, orders: [] };
  }
}

// ============ ADMIN FUNCTIONS ============

// Add Product (Admin only)
async function addProduct(productData) {
  try {
    const productRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true, productId: productRef.id };
  } catch (error) {
    console.error("Add product error:", error);
    return { success: false, message: "Failed to add product" };
  }
}

// Update Product (Admin only)
async function updateProduct(productId, updates) {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, message: "Failed to update product" };
  }
}

// Delete Product (Admin only)
async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, message: "Failed to delete product" };
  }
}

// Get All Orders (Admin only)
async function getAllOrders() {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, orders: orders };
  } catch (error) {
    console.error("Get orders error:", error);
    return { success: false, orders: [] };
  }
}

// Get All Customers (Admin only)
async function getAllCustomers() {
  try {
    const customersRef = collection(db, "customers");
    const querySnapshot = await getDocs(customersRef);

    const customers = [];
    querySnapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, customers: customers };
  } catch (error) {
    console.error("Get customers error:", error);
    return { success: false, customers: [] };
  }
}

// Update Order Status (Admin only)
async function updateOrderStatus(orderId, status) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      orderStatus: status,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error("Update order error:", error);
    return { success: false, message: "Failed to update order" };
  }
}

// Get Dashboard Stats (Admin only)
async function getDashboardStats() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const customersSnapshot = await getDocs(collection(db, "customers"));

    let totalSales = 0;
    let pendingOrders = 0;

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      totalSales += order.total || 0;
      if (order.orderStatus === "pending") pendingOrders++;
    });

    return {
      success: true,
      stats: {
        totalProducts: productsSnapshot.size,
        totalOrders: ordersSnapshot.size,
        totalCustomers: customersSnapshot.size,
        totalSales: totalSales,
        pendingOrders: pendingOrders,
      },
    };
  } catch (error) {
    console.error("Stats error:", error);
    return { success: false, stats: null };
  }
}

// Export all functions
export {
  // Customer functions
  customerSignup,
  customerLogin,
  sendResetOTP,
  resetPassword,
  getCustomerProfile,
  updateCustomerProfile,
  placeOrder,
  getCustomerOrders,
  // Admin functions
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getAllCustomers,
  updateOrderStatus,
  getDashboardStats,
  // Auth helpers
  signOut,
  onAuthStateChanged,
  isAdmin,
  getUserRole,
};
