import { useEffect, useRef } from "react";
import "./Cursor.css";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx - 6 + "px";
      dot.style.top = my - 6 + "px";
      ring.style.left = mx - 22 + "px";
      ring.style.top = my - 22 + "px";
    };

    const grow = () => {
      dot.style.transform = "scale(2.5)";
      ring.style.width = "64px";
      ring.style.height = "64px";
      ring.style.opacity = "0.9";
      ring.style.left = mx - 32 + "px";
      ring.style.top = my - 32 + "px";
    };
    const shrink = () => {
      dot.style.transform = "scale(1)";
      ring.style.width = "44px";
      ring.style.height = "44px";
      ring.style.opacity = "0.5";
    };

    document.addEventListener("mousemove", move);
    document.querySelectorAll("button, a, .cat-card, .product-card, .nav-link").forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => document.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
