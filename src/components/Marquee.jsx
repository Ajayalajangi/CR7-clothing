import "./Marquee.css";

const items = ["MENS", "WOMENS", "ACCESSORIES", "OVERSIZED TEES", "PREMIUM DENIM", "JOGGERS", "STREETWEAR", "FRESH DROPS", "NEW SEASON"];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div className="marquee-item" key={i}>
            {item}
            <span className="marquee-dot" />
          </div>
        ))}
      </div>
    </div>
  );
}
