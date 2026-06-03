import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Marquee from "./components/Marquee";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Features from "./components/Features";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Cursor from "./components/Cursor";
import Loader from "./components/Loader";
import ScrollProgress from "./components/ScrollProgress";
import AdminPanel from "./components/AdminPanel";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import "./styles/globals.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Secret shortcut: Ctrl+Shift+A opens admin
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") setAdminOpen(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (loading) return <Loader />;

  return (
    <ProductProvider>
      <CartProvider>
        <div className="app">
          <Cursor />
          <ScrollProgress />
          <Navbar onAdminOpen={() => setAdminOpen(true)} />
          <Cart />
          {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
          <main>
            <Hero />
            <StatsBar />
            <Marquee />
            <Categories />
            <Products />
            <Features />
            <Newsletter />
          </main>
          <Footer onAdminOpen={() => setAdminOpen(true)} />
        </div>
      </CartProvider>
    </ProductProvider>
  );
}
