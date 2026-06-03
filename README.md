# CR7 Clothing – Animated React App

A fully animated, production-ready React landing page for **CR7 Clothing**.

---

## ✨ Features

- 🎬 **Loader Screen** – Animated CR7 logo with progress bar
- 🖱️ **Custom Cursor** – Orange dot + expanding ring, grows on hover
- 📊 **Scroll Progress Bar** – Orange glowing line at top
- 🌟 **Floating Particles** – Rising orange particles in hero
- ⚡ **Glitch Text Effect** – "STYLE." glitches every 6 seconds
- 🔢 **Count-Up Animations** – Stats count up when scrolled into view
- 📜 **Scroll Reveal** – Every section fades + slides up
- ♾️ **Infinite Marquee** – Auto-scrolling category ticker
- 🛒 **Sliding Cart Drawer** – Add/remove items, qty controls, totals
- 🔔 **Toast Notifications** – "Added to cart!" popup
- 🎛️ **Product Filter Tabs** – Filter by MENS / GIRLS / ACCESSORIES
- 📱 **Fully Responsive** – Mobile hamburger menu, stacked layouts
- 🔥 **Firebase Ready** – Just `npm run build` and deploy

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open http://localhost:5173

### 3. Build for production

```bash
npm run build
```

### 4. Deploy to Firebase

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Login
firebase login

# Init (if not already)
firebase init hosting
# Choose: dist folder, SPA rewrite yes

# Deploy
firebase deploy
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx / .css       ← Fixed nav, hamburger, cart icon
│   ├── Hero.jsx / .css         ← Hero with particles, glitch, floating tags
│   ├── StatsBar.jsx / .css     ← Count-up animated stats
│   ├── Marquee.jsx / .css      ← Infinite scrolling ticker
│   ├── Categories.jsx / .css   ← Category cards with hover glow
│   ├── Products.jsx / .css     ← Filter tabs + product grid
│   ├── Features.jsx / .css     ← 4 brand feature cards
│   ├── Newsletter.jsx / .css   ← Email subscribe with success state
│   ├── Cart.jsx / .css         ← Sliding cart drawer
│   ├── Cursor.jsx / .css       ← Custom cursor
│   ├── Loader.jsx / .css       ← Loading screen
│   └── ScrollProgress.jsx / .css
├── context/
│   └── CartContext.jsx         ← Cart state management
├── data/
│   └── products.js             ← Product & category data
├── hooks/
│   └── useScrollReveal.js      ← IntersectionObserver hook
├── styles/
│   └── globals.css             ← Global styles, CSS variables
├── App.jsx
└── main.jsx
```

---

## 🎨 Customization

**Colors** – Edit CSS variables in `src/styles/globals.css`:
```css
:root {
  --orange: #ff7a00;   /* Brand accent */
  --dark: #0a0a0a;     /* Background */
}
```

**Products** – Edit `src/data/products.js` to add/change products.

**Brand name** – Search & replace `CR7` across components.

---

Built with ❤️ by **Ajay Cruzz** · © 2025 CR7 Clothing
