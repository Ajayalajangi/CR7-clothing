import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar({ onAdminOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, setCartOpen } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-logo">CR7</div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {["New", "Shop", "Collections", "Community"].map((link) => (
          <li key={link}>
            <a href="#" className="nav-link" onClick={() => setMenuOpen(false)}>{link}</a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <button className="admin-trigger-btn" onClick={onAdminOpen} title="Admin Panel (Ctrl+Shift+A)">
          ⚙️
        </button>
        <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
        <button className="btn-primary nav-cta">Shop Now</button>
        <button className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
