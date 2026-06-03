import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const {
    cartItems, cartOpen, setCartOpen,
    removeFromCart, updateQty,
    totalItems, totalPrice, toastMsg,
  } = useCart();

  useEffect(() => {
    document.body.classList.toggle("cart-open", cartOpen);
  }, [cartOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${cartOpen ? "open" : ""}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>
            {totalItems > 0 && (
              <span className="cart-count">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
            )}
          </div>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <button
                className="btn-primary"
                style={{ marginTop: "1rem" }}
                onClick={() => setCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">{item.emoji}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-cat">{item.cat}</div>
                  <div className="cart-item-price">{item.price}</div>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-ctrl">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-totals">
              <div className="cart-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="cart-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="cart-row total">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn-primary checkout-btn">
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={`toast ${toastMsg ? "show" : ""}`}>{toastMsg}</div>
    </>
  );
}
