import "./Footer.css";

export default function Footer({ onAdminOpen }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">CR7</div>
          <p className="footer-tagline">Conscious clothing since 2025</p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn">📸</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn">🐦</a>
            <a href="mailto:cr7clothing@gmail.com" className="social-btn">✉️</a>
          </div>
        </div>
        <div className="footer-links-group">
          <h4>Support</h4>
          <a href="#">FAQs</a>
          <a href="#">Shipping & Returns</a>
          <a href="#">Size Guide</a>
          <a href="#">Track Order</a>
        </div>
        <div className="footer-links-group">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Accessibility</a>
        </div>
        <div className="footer-links-group">
          <h4>Connect</h4>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          <a href="mailto:cr7clothing@gmail.com">cr7clothing@gmail.com</a>
          <button className="footer-admin-btn" onClick={onAdminOpen}>⚙️ Admin Panel</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 CR7 Clothing. All rights reserved.</span>
        <span className="footer-credit">Website developed by <span>Ajay Cruzz</span></span>
      </div>
      <div className="footer-bg-text">CR7</div>
    </footer>
  );
}
