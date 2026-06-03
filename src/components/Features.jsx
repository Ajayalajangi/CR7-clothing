import { useScrollReveal } from "../hooks/useScrollReveal";
import "./Features.css";

const features = [
  { icon: "🌿", title: "Sustainably Made", desc: "Eco-conscious fabrics sourced from certified suppliers committed to the planet." },
  { icon: "✂️", title: "Premium Quality", desc: "Every stitch is precision-crafted for durability you can feel in every wear." },
  { icon: "🚀", title: "Fast Delivery", desc: "Express shipping across 4 cities. Get your order in 2–3 business days." },
  { icon: "↩️", title: "Easy Returns", desc: "No questions asked 30-day return policy. Your satisfaction is guaranteed." },
];

function FeatureCard({ feature, index }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`feature-card reveal ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="feature-icon">{feature.icon}</div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-desc">{feature.desc}</p>
    </div>
  );
}

export default function Features() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="section features-section">
      <div ref={ref} className={`reveal ${visible ? "visible" : ""}`}>
        <div className="section-label">Why CR7</div>
        <h2 className="section-title">BUY BETTER.<br />WEAR LONGER.</h2>
        <p className="section-sub">
          Clean fits, premium feel, and comfort that lasts. Made to stay with you season after season.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}
