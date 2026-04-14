const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="nav-logo">My App</h2>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="/" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-link">Login</a>
          </li>
          <li className="nav-item">
            <a href="/register" className="nav-link">Register</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;