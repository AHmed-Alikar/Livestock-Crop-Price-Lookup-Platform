import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">Price Lookup</Link>
    </nav>
  );
}
