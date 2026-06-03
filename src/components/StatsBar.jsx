import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./StatsBar.css";

function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal(0.5);
  const done = useRef(false);

  useEffect(() => {
    if (!visible || done.current) return;
    done.current = true;
    const dur = 1800;
    const start = performance.now();
    const animate = (now) => {
      const prog = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setCount(Math.round(ease * target));
      if (prog < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [visible, target]);

  return (
    <span ref={ref} className="stat-num">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { target: 12, suffix: "+", label: "Collections" },
  { target: 500, suffix: "+", label: "Products" },
  { target: 10000, suffix: "+", label: "Happy Customers" },
  { target: 4, suffix: " Cities", label: "Delivered Across" },
];

export default function StatsBar() {
  return (
    <div className="stats-bar">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <CountUp target={s.target} suffix={s.suffix} />
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
