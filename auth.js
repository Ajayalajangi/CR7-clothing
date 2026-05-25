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
  increment,
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
async function placeOrder(customerId, customerName, items, total, shippingAddress) {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      customerId: customerId,
      customer: { name: customerName },  // Use consistent 'customer' object
      customerName: customerName,  // Keep both for backward compatibility
      items: items,
      total: total,
      shippingAddress: shippingAddress,
      orderStatus: "pending",
      status: "pending",  // Add both for compatibility
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (const item of items) {
      if (item.id) {
        const productRef = doc(db, "products", item.id);
        await updateDoc(productRef, { stock: increment(-item.quantity) });
      }
    }
    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error("Place order error:", error);
    return { success: false, message: "Failed to update order or inventory" };
  }
}


// Get Customer Orders
async function getCustomerOrders(userId) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("customerId", "==", userId),
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

// FIXED BUG: Added missing getAllProducts function to load the table data
async function getAllProducts() {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, products: products };
  } catch (error) {
    console.error("Get products error:", error);
    return { success: false, products: [] };
  }
}

// FIXED GAP: Updated addProduct to take the file data payload cleanly
async function addProduct(productData, imageFile) {
  try {
    let finalImageUrl = "https://placehold.co/400x500/1a1a1a/ffffff?text=" + encodeURIComponent(productData.name);

    // Optional Helper: Handle local file preview as base64 data string if image exists
    if (imageFile) {
      finalImageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(imageFile);
      });
    }

    const productRef = await addDoc(collection(db, "products"), {
      ...productData,
      image: finalImageUrl,
      mainImage: finalImageUrl,
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
    const productsSnapshot = await getDocs(collection(db, \"products\"));
    const ordersSnapshot = await getDocs(collection(db, \"orders\"));
    const customersSnapshot = await getDocs(collection(db, \"customers\"));

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
  getAllProducts, // Now successfully exported for admin use
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