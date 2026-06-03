import { useProducts } from "../context/ProductContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useCart } from "../context/CartContext";
import "./Products.css";

const filters = ["ALL", "MENS", "GIRLS", "ACCESSORIES"];

function ProductCard({ product, index }) {
  const { addToCart } = useCart();
  const { ref, visible } = useScrollReveal();

  const discountedPrice = product.isOffer && product.offerPct > 0
    ? Math.round(parseInt(product.price.replace(/[^0-9]/g, "")) * (1 - product.offerPct / 100))
    : null;

  return (
    <div ref={ref} className={`product-card reveal ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${(index % 4) * 0.08}s` }}>
      <div className="product-img">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {product.isNew && <span className="product-badge-new">🆕 NEW</span>}
        {product.isOffer && product.offerPct > 0 && (
          <span className="product-badge-offer">🔥 {product.offerPct}% OFF</span>
        )}
        <span className="product-emoji">{product.emoji}</span>
        <button className="product-quick" onClick={() => addToCart(product)}>
          Add to Cart +
        </button>
      </div>
      <div className="product-info">
        <div className="product-cat">{product.cat}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-row">
          <div className="product-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < product.stars ? "star filled" : "star"}>★</span>
            ))}
          </div>
          <div className="product-price-wrap">
            {discountedPrice ? (
              <>
                <span className="price-original">{product.price}</span>
                <span className="product-price">₹{discountedPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="product-price">{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { filteredProducts, activeCategory, setActiveCategory } = useProducts();
  const { ref: headRef, visible: headVisible } = useScrollReveal();

  return (
    <section className="section products-section" id="products-section">
      <div ref={headRef} className={`reveal ${headVisible ? "visible" : ""}`}>
        <div className="section-label">Fresh Drops</div>
        <h2 className="section-title">PICKED<br />JUST FOR YOU</h2>
        <p className="section-sub">Sustainable, versatile pieces made to last season after season.</p>
      </div>

      <div className="filter-tabs">
        {filters.map((f) => (
          <button key={f} className={`filter-tab ${activeCategory === f ? "active" : ""}`}
            onClick={() => setActiveCategory(f)}>
            {f}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <div style={{ fontSize: "3rem" }}>🔍</div>
          <p>No products in this category yet.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
