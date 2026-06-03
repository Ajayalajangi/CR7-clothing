import { useProducts } from "../context/ProductContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./Categories.css";

const categories = [
  { id: 1, name: "MENS",        count: "120+ STYLES", emoji: "👨", filter: "MENS"        },
  { id: 2, name: "GIRLS",       count: "90+ STYLES",  emoji: "👩", filter: "GIRLS"       },
  { id: 3, name: "SHOES",       count: "60+ STYLES",  emoji: "👟", filter: "SHOES"       },
  { id: 4, name: "ACCESSORIES", count: "80+ ITEMS",   emoji: "👜", filter: "ACCESSORIES" },
  { id: 5, name: "OVERSIZED",   count: "45+ STYLES",  emoji: "📏", filter: "OVERSIZED"   },
  { id: 6, name: "ALL",         count: "400+ ITEMS",  emoji: "🎲", filter: "ALL"         },
];

function RevealDiv({ children, delay }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""}`}
      style={{ transitionDelay: delay || "0s" }}>
      {children}
    </div>
  );
}

export default function Categories() {
  const { activeCategory, setActiveCategory } = useProducts();

  const handleCategoryClick = (filter) => {
    setActiveCategory(filter);
    // Smooth scroll to products section
    setTimeout(() => {
      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="section categories-section">
      <RevealDiv><div className="section-label">Shop by Category</div></RevealDiv>
      <RevealDiv delay="0.1s"><h2 className="section-title">CURATED FOR<br />EVERY VIBE</h2></RevealDiv>
      <RevealDiv delay="0.2s"><p className="section-sub">Tap a category below to explore that collection.</p></RevealDiv>

      <div className="cat-grid">
        {categories.map((cat, i) => (
          <RevealDiv key={cat.id} delay={`${0.08 * (i % 4)}s`}>
            <button
              className={`cat-card ${activeCategory === cat.filter ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.filter)}
              aria-label={`Filter by ${cat.name}`}
            >
              <div className="cat-card-glow" />
              {activeCategory === cat.filter && <div className="cat-active-ring" />}
              <span className="cat-icon">{cat.emoji}</span>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count}</div>
              <div className="cat-arrow">
                {activeCategory === cat.filter ? "✓" : "→"}
              </div>
            </button>
          </RevealDiv>
        ))}
      </div>
    </section>
  );
}
