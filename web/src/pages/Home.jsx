import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <h1>Livestock &amp; Crop Price Lookup</h1>
      <p>Compare current market prices before you sell. No account needed to browse.</p>
      <div className="category-grid">
        <Link to="/items/Livestock" className="category-card">
          <h2>Livestock</h2>
          <p>Goats, camels, cattle, sheep</p>
        </Link>
        <Link to="/items/Crop" className="category-card">
          <h2>Crop</h2>
          <p>Maize, sorghum, and more</p>
        </Link>
      </div>
    </div>
  );
}
