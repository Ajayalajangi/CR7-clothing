import { useEffect, useRef } from "react";
import "./Hero.css";

export default function Hero() {
  const particlesRef = useRef(null);

  useEffect(() => {
    const wrap = particlesRef.current;
    if (!wrap) return;
    for (let i = 0; i < 35; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 8 + Math.random() * 14 + "s";
      p.style.animationDelay = Math.random() * 15 + "s";
      const size = 2 + Math.random() * 4;
      p.style.width = size + "px";
      p.style.height = size + "px";
      wrap.appendChild(p);
    }
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="grid-lines" />
      <div className="particles" ref={particlesRef} />

      <div className="hero-content">
        <div className="hero-tag">
          <span className="tag-dot" />
          New Collection 2025
          <span className="live-badge">
            <span className="live-dot" />
            Live
          </span>
        </div>

        <h1 className="hero-title">
          EFFORTLESS<br />
          <span className="glitch" data-text="STYLE.">STYLE.</span>
          <br />EVERY DAY.
        </h1>

        <p className="hero-sub">
          Minimal design. Maximum comfort. Everyday confidence —
          engineered for the bold.
        </p>

        <div className="hero-btns">
          <button className="btn-primary">Shop Now →</button>
          <button className="btn-secondary">Explore Collections</button>
        </div>

        <div className="hero-stats">
          <div className="hs"><span className="hs-n">500+</span><span className="hs-l">Products</span></div>
          <div className="hs-div" />
          <div className="hs"><span className="hs-n">10K+</span><span className="hs-l">Customers</span></div>
          <div className="hs-div" />
          <div className="hs"><span className="hs-n">4.9★</span><span className="hs-l">Rating</span></div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card">
          <div className="hero-card-inner">
            <div className="hero-emoji">👕</div>
            <div className="hero-card-label">CR7 STYLE</div>
            <div className="hero-card-sub">New Arrival</div>
          </div>
          <div className="hero-card-ring ring-1" />
          <div className="hero-card-ring ring-2" />
          <div className="hero-card-ring ring-3" />
        </div>
        <div className="floating-tags">
          <span className="ftag ftag-1">🔥 Trending</span>
          <span className="ftag ftag-2">✨ New Drop</span>
          <span className="ftag ftag-3">💯 Premium</span>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
