import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import "./AdminPanel.css";

const ADMIN_PASSWORD = "cr7admin123";

const EMOJI_OPTIONS = ["👕","👖","👚","🧥","👔","🧢","👟","👜","🕶️","🏃","👗","🩱","🧣","🧤","🥿","👠","👡","🎒","🧳"];
const CATS = ["MENS","GIRLS","ACCESSORIES","SHOES","OVERSIZED"];
const BADGES = ["","NEW","HOT","SALE","BESTSELLER"];

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    name: "", cat: "MENS", price: "₹", badge: "", emoji: "👕",
    stars: 5, isNew: false, isOffer: false, offerPct: 0
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.price) return alert("Name and price are required!");
    onSave(form);
    onClose();
  };

  return (
    <div className="admin-form">
      <div className="form-row">
        <label>Product Name *</label>
        <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Urban Oversized Tee" />
      </div>
      <div className="form-row two-col">
        <div>
          <label>Category *</label>
          <select value={form.cat} onChange={e => set("cat", e.target.value)}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Badge</label>
          <select value={form.badge} onChange={e => set("badge", e.target.value)}>
            {BADGES.map(b => <option key={b} value={b}>{b || "(none)"}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row two-col">
        <div>
          <label>Price (₹) *</label>
          <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="₹999" />
        </div>
        <div>
          <label>Stars (1-5)</label>
          <input type="number" min="1" max="5" value={form.stars}
            onChange={e => set("stars", Number(e.target.value))} />
        </div>
      </div>
      <div className="form-row">
        <label>Emoji Icon</label>
        <div className="emoji-grid">
          {EMOJI_OPTIONS.map(em => (
            <button key={em} type="button"
              className={`emoji-btn ${form.emoji === em ? "active" : ""}`}
              onClick={() => set("emoji", em)}>{em}</button>
          ))}
        </div>
      </div>
      <div className="form-row two-col">
        <label className="checkbox-label">
          <input type="checkbox" checked={form.isNew}
            onChange={e => set("isNew", e.target.checked)} />
          Mark as New Arrival
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={form.isOffer}
            onChange={e => set("isOffer", e.target.checked)} />
          Has Offer/Discount
        </label>
      </div>
      {form.isOffer && (
        <div className="form-row">
          <label>Discount % (e.g. 15 for 15% off)</label>
          <input type="number" min="1" max="90" value={form.offerPct}
            onChange={e => set("offerPct", Number(e.target.value))} />
        </div>
      )}
      <div className="form-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave}>
          {initial ? "💾 Save Changes" : "➕ Add Product"}
        </button>
      </div>
    </div>
  );
}

function OfferForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { title: "", desc: "", code: "", active: true });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = () => {
    if (!form.title || !form.code) return alert("Title and code are required!");
    onSave(form);
    onClose();
  };
  return (
    <div className="admin-form">
      <div className="form-row">
        <label>Offer Title *</label>
        <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Summer Sale" />
      </div>
      <div className="form-row">
        <label>Description</label>
        <input value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="e.g. Up to 30% off" />
      </div>
      <div className="form-row">
        <label>Coupon Code *</label>
        <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} placeholder="e.g. SAVE20" />
      </div>
      <div className="form-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave}>
          {initial ? "💾 Save Changes" : "➕ Add Offer"}
        </button>
      </div>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { onLogin(); setErr(""); }
    else setErr("❌ Wrong password. Try: cr7admin123");
  };
  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <div className="admin-logo">CR7</div>
        <h2>Admin Panel</h2>
        <p>Enter admin password to continue</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          placeholder="Password" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        {err && <div className="login-err">{err}</div>}
        <button className="btn-save" style={{ width: "100%" }} onClick={handleLogin}>
          🔐 Login
        </button>
        <p className="login-hint">Demo password: <code>cr7admin123</code></p>
      </div>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────
export default function AdminPanel({ onClose }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("products");
  const [modal, setModal] = useState(null); // { type: "add"|"edit", data? }
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");

  const {
    products, offers, newArrivals,
    addProduct, updateProduct, deleteProduct,
    addOffer, updateOffer, deleteOffer, toggleOffer,
  } = useProducts();

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.cat.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Products",  value: products.length,                  icon: "📦" },
    { label: "New Arrivals",    value: newArrivals.length,               icon: "🆕" },
    { label: "Active Offers",   value: offers.filter(o => o.active).length, icon: "🔥" },
    { label: "Categories",      value: [...new Set(products.map(p=>p.cat))].length, icon: "🗂️" },
  ];

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <span className="admin-logo-sm">CR7</span>
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage your store</p>
          </div>
        </div>
        <div className="admin-header-right">
          <span className="admin-badge">🟢 Admin</span>
          <button className="admin-close-btn" onClick={onClose}>✕ Close</button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {stats.map(s => (
          <div className="admin-stat-card" key={s.label}>
            <span className="ast-icon">{s.icon}</span>
            <span className="ast-val">{s.value}</span>
            <span className="ast-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[["products","📦 Products"],["offers","🔥 Offers"],["arrivals","🆕 New Arrivals"]].map(([key,label]) => (
          <button key={key} className={`admin-tab ${tab===key?"active":""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <div className="admin-content">
          <div className="admin-toolbar">
            <input className="admin-search" placeholder="🔍 Search products..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn-save" onClick={() => setModal({ type: "add" })}>
              ➕ Add Product
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th><th>Category</th><th>Price</th>
                  <th>Badge</th><th>Stars</th><th>Flags</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="td-product">
                        <span className="td-emoji">{p.emoji}</span>
                        <span className="td-name">{p.name}</span>
                      </div>
                    </td>
                    <td><span className="td-cat">{p.cat}</span></td>
                    <td className="td-price">{p.price}</td>
                    <td>{p.badge ? <span className="td-badge">{p.badge}</span> : <span className="td-none">—</span>}</td>
                    <td>{"★".repeat(p.stars)}</td>
                    <td>
                      <div className="td-flags">
                        {p.isNew   && <span className="flag flag-new">NEW</span>}
                        {p.isOffer && <span className="flag flag-offer">{p.offerPct}% OFF</span>}
                      </div>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="act-btn edit" onClick={() => setModal({ type: "edit", data: p })}>✏️</button>
                        <button className="act-btn del"
                          onClick={() => setDeleteConfirm({ id: p.id, name: p.name, kind: "product" })}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="admin-empty">No products found.</div>}
          </div>
        </div>
      )}

      {/* ── OFFERS TAB ── */}
      {tab === "offers" && (
        <div className="admin-content">
          <div className="admin-toolbar">
            <h3 className="tab-heading">Manage Offers & Coupons</h3>
            <button className="btn-save" onClick={() => setModal({ type: "addOffer" })}>
              ➕ New Offer
            </button>
          </div>
          <div className="offers-grid">
            {offers.map(o => (
              <div key={o.id} className={`offer-card ${o.active ? "active" : "inactive"}`}>
                <div className="offer-card-top">
                  <div>
                    <div className="offer-title">{o.title}</div>
                    <div className="offer-desc">{o.desc}</div>
                    <div className="offer-code">🎫 {o.code}</div>
                  </div>
                  <span className={`offer-status ${o.active ? "on" : "off"}`}>
                    {o.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="offer-actions">
                  <button className="act-btn toggle" onClick={() => toggleOffer(o.id)}>
                    {o.active ? "⏸ Deactivate" : "▶ Activate"}
                  </button>
                  <button className="act-btn edit" onClick={() => setModal({ type: "editOffer", data: o })}>✏️ Edit</button>
                  <button className="act-btn del"
                    onClick={() => setDeleteConfirm({ id: o.id, name: o.title, kind: "offer" })}>🗑️</button>
                </div>
              </div>
            ))}
            {offers.length === 0 && <div className="admin-empty">No offers yet. Add one!</div>}
          </div>
        </div>
      )}

      {/* ── NEW ARRIVALS TAB ── */}
      {tab === "arrivals" && (
        <div className="admin-content">
          <div className="admin-toolbar">
            <h3 className="tab-heading">New Arrivals ({newArrivals.length})</h3>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem"}}>
              Mark products as "New Arrival" when editing them.
            </p>
          </div>
          <div className="arrivals-grid">
            {newArrivals.length === 0 && (
              <div className="admin-empty">No products marked as New Arrival yet.</div>
            )}
            {newArrivals.map(p => (
              <div key={p.id} className="arrival-card">
                <div className="arrival-emoji">{p.emoji}</div>
                <div className="arrival-name">{p.name}</div>
                <div className="arrival-cat">{p.cat}</div>
                <div className="arrival-price">{p.price}</div>
                <button className="act-btn edit" style={{width:"100%",marginTop:"0.6rem"}}
                  onClick={() => setModal({ type: "edit", data: p })}>✏️ Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {modal?.type === "add" && (
        <Modal title="➕ Add New Product" onClose={() => setModal(null)}>
          <ProductForm onSave={addProduct} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="✏️ Edit Product" onClose={() => setModal(null)}>
          <ProductForm initial={modal.data}
            onSave={(data) => updateProduct(modal.data.id, data)}
            onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "addOffer" && (
        <Modal title="➕ New Offer" onClose={() => setModal(null)}>
          <OfferForm onSave={addOffer} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "editOffer" && (
        <Modal title="✏️ Edit Offer" onClose={() => setModal(null)}>
          <OfferForm initial={modal.data}
            onSave={(data) => updateOffer(modal.data.id, data)}
            onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3>Delete "{deleteConfirm.name}"?</h3>
            <p>This action cannot be undone.</p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-delete" onClick={() => {
                if (deleteConfirm.kind === "product") deleteProduct(deleteConfirm.id);
                else deleteOffer(deleteConfirm.id);
                setDeleteConfirm(null);
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
