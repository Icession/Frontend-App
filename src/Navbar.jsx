import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const hideNavbar = ['/', '/login', '/register'].includes(location.pathname);

  if (hideNavbar) return null;

  return (
    <nav className="navbar">
      <Link to="/home" className="nav-brand">
        <span className="brand-text">RideWatch</span>
      </Link>
      <ul className="nav-menu">
        <li>
          <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>Home</Link>
        </li>
        <li>
          <Link to="/maps" className={`nav-link ${location.pathname === '/maps' ? 'active' : ''}`}>Map</Link>
        </li>
        <li>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
        </li>
        <li>
          <Link to="/faq" className={`nav-link ${location.pathname === '/Faq' ? 'active' : ''}`}>FAQ</Link>
        </li>
        <li>
          <Link to="/account" className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}>Account</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;