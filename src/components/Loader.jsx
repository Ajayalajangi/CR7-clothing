import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader">
      <div className="loader-inner">
        <div className="loader-logo">CR7</div>
        <div className="loader-bar">
          <div className="loader-fill" />
        </div>
        <div className="loader-text">Loading Collection...</div>
      </div>
      <div className="loader-bg-text">CR7</div>
    </div>
  );
}
