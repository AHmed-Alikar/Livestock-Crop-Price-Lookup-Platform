import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Price Lookup</Link>
      <div className="nav-links">
        {!user && (
          <>
            <Link to="/trader/login">Trader Login</Link>
            <Link to="/admin/login">Admin Login</Link>
          </>
        )}
        {user?.role === 'trader' && (
          <>
            <Link to="/trader/submit">Submit Price</Link>
            <Link to="/trader/submissions">My Submissions</Link>
            <span className="user-chip">{user.name}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/queue">Pending Queue</Link>
            <Link to="/admin/manage">Manage Items/Markets</Link>
            <span className="user-chip">{user.name}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        )}
      </div>
    </nav>
  );
}
