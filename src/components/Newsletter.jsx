import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./Newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { ref, visible } = useScrollReveal();

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="section newsletter-section">
      <div className="nl-bg" />
      <div
        ref={ref}
        className={`nl-content reveal ${visible ? "visible" : ""}`}
      >
        <div className="section-label" style={{ justifyContent: "center" }}>
          Exclusive Offer
        </div>
        <h2 className="section-title nl-title">
          GET 15% OFF<br />YOUR FIRST<br />ORDER
        </h2>
        <p className="section-sub nl-sub">
          Join thousands of style-conscious people who trust CR7 for their everyday wardrobe.
        </p>

        {submitted ? (
          <div className="nl-success">
            <span className="nl-success-icon">✅</span>
            <p>You're in! Check your inbox for your 15% off code.</p>
          </div>
        ) : (
          <div className="nl-form">
            <input
              type="email"
              className="nl-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button className="btn-primary nl-btn" onClick={handleSubmit}>
              Subscribe →
            </button>
          </div>
        )}

        <p className="nl-note">No spam. Unsubscribe anytime. We respect your privacy.</p>
      </div>
    </section>
  );
}
