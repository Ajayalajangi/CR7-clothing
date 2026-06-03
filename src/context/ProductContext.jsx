import { createContext, useContext, useState } from "react";

const initialProducts = [
  { id: 1,  name: "Urban Oversized Tee",    cat: "MENS",        price: "₹899",   badge: "NEW",        emoji: "👕", stars: 5, isNew: true,  isOffer: false, offerPct: 0  },
  { id: 2,  name: "Slim Fit Cargo Jogger",  cat: "MENS",        price: "₹1,299", badge: "HOT",        emoji: "👖", stars: 4, isNew: false, isOffer: false, offerPct: 0  },
  { id: 3,  name: "Floral Crop Shirt",      cat: "GIRLS",       price: "₹799",   badge: "NEW",        emoji: "👚", stars: 5, isNew: true,  isOffer: true,  offerPct: 10 },
  { id: 4,  name: "Premium Denim Jacket",   cat: "MENS",        price: "₹2,199", badge: "",           emoji: "🧥", stars: 4, isNew: false, isOffer: false, offerPct: 0  },
  { id: 5,  name: "Boho Maxi Trousers",     cat: "GIRLS",       price: "₹1,099", badge: "SALE",       emoji: "👖", stars: 5, isNew: false, isOffer: true,  offerPct: 20 },
  { id: 6,  name: "Classic Cap",            cat: "ACCESSORIES", price: "₹399",   badge: "",           emoji: "🧢", stars: 4, isNew: false, isOffer: false, offerPct: 0  },
  { id: 7,  name: "Leather Crossbody Bag",  cat: "ACCESSORIES", price: "₹1,599", badge: "HOT",        emoji: "👜", stars: 5, isNew: false, isOffer: false, offerPct: 0  },
  { id: 8,  name: "Classic White Tee",      cat: "MENS",        price: "₹549",   badge: "BESTSELLER", emoji: "👕", stars: 5, isNew: false, isOffer: true,  offerPct: 15 },
  { id: 9,  name: "Women's Crop Jogger",    cat: "GIRLS",       price: "₹899",   badge: "NEW",        emoji: "🏃", stars: 4, isNew: true,  isOffer: false, offerPct: 0  },
  { id: 10, name: "Aviator Sunglasses",     cat: "ACCESSORIES", price: "₹699",   badge: "",           emoji: "🕶️", stars: 4, isNew: false, isOffer: false, offerPct: 0  },
  { id: 11, name: "Relaxed Linen Shirt",    cat: "MENS",        price: "₹1,199", badge: "NEW",        emoji: "👔", stars: 5, isNew: true,  isOffer: false, offerPct: 0  },
  { id: 12, name: "Chunky Sneakers",        cat: "ACCESSORIES", price: "₹2,499", badge: "HOT",        emoji: "👟", stars: 5, isNew: false, isOffer: false, offerPct: 0  },
];

const initialOffers = [
  { id: 1, title: "Summer Sale", desc: "Up to 30% off on selected items", code: "SUMMER30", active: true  },
  { id: 2, title: "First Order", desc: "15% off your first purchase",      code: "FIRST15",  active: true  },
  { id: 3, title: "Weekend Deal", desc: "Flat ₹200 off on orders above ₹1500", code: "WKND200", active: false },
];

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts]   = useState(initialProducts);
  const [offers,   setOffers]     = useState(initialOffers);
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Products CRUD
  const addProduct = (p) =>
    setProducts((prev) => [...prev, { ...p, id: Date.now(), stars: 4 }]);

  const updateProduct = (id, data) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));

  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  // Offers CRUD
  const addOffer = (o) =>
    setOffers((prev) => [...prev, { ...o, id: Date.now(), active: true }]);

  const updateOffer = (id, data) =>
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));

  const deleteOffer = (id) =>
    setOffers((prev) => prev.filter((o) => o.id !== id));

  const toggleOffer = (id) =>
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );

  // Derived
  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.cat === activeCategory);

  const newArrivals = products.filter((p) => p.isNew);

  return (
    <ProductContext.Provider
      value={{
        products, filteredProducts, newArrivals,
        offers,
        activeCategory, setActiveCategory,
        addProduct, updateProduct, deleteProduct,
        addOffer, updateOffer, deleteOffer, toggleOffer,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
