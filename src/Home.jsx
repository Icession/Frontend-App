import { useState } from "react";
import "./Home.css";
import About from "./About";
import Faq from "./Faq";
import Account from "./Account";
import EmergencyAlert from "./EmergencyAlert";
import EmergencyContacts from "./EmergencyContacts";
import NotificationsDropdown from "./NotificationsDropdown";

function Navbar({ activePage, setActivePage }) {
  const links = ["Home", "About", "F.A.Q", "Account"];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="#8b0000" strokeWidth="2.5" fill="none"/>
            <circle cx="20" cy="20" r="12" stroke="#8b0000" strokeWidth="2" fill="none"/>
            <circle cx="20" cy="20" r="6" stroke="#8b0000" strokeWidth="2" fill="none"/>
            <path d="M14 26 C14 22 17 18 20 16 C23 18 26 22 26 26" stroke="#8b0000" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="20" cy="27" r="2.5" fill="#8b0000"/>
          </svg>
        </div>
        <span className="brand-text">Ride<strong>Watch</strong></span>
      </div>

      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link}>
            <button
              className={`nav-link ${activePage === link ? "active" : ""}`}
              onClick={() => setActivePage(link)}
            >
              {link}
            </button>
          </li>
        ))}
      </ul>
      <NotificationsDropdown />
    </nav>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");

  return (
    <main className="home-main">
      <div className="home-content">
        <div className="home-left">
          <h1 className="home-heading">
            Start your safe journey here at RideWatch
          </h1>
          <p className="home-subtext">
            Safe rides begin with one step. Let's get you started.
          </p>

          <div className="search-section">
            <p className="search-label">Decided on where you're headed?</p>
            <div className="search-row">
              <div className="search-input-wrap">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search for routes"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="btn-search">Search</button>
            </div>
            <button className="btn-routes">Routes</button>
          </div>
        </div>

        <div className="home-right">
          <div className="hero-card">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg">
              <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
              <circle cx="100" cy="100" r="65" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
              <circle cx="100" cy="100" r="40" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              <circle cx="100" cy="100" r="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
              <rect x="68" y="72" width="64" height="42" rx="6" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
              <rect x="73" y="77" width="24" height="14" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="103" y="77" width="24" height="14" rx="2" fill="rgba(255,255,255,0.4)"/>
              <circle cx="80" cy="118" r="6" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
              <circle cx="120" cy="118" r="6" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
              <circle cx="100" cy="138" r="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
              <path d="M100 132 V138 L104 141" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    switch (activePage) {
      case "Home":               return <HomePage />;
      case "About":              return <About />;
      case "F.A.Q":             return <Faq />;
      case "Account":            return <Account setActivePage={setActivePage} />;
      case "EmergencyContacts":  return <EmergencyContacts onBack={() => setActivePage("Account")} />;
      default:                   return <HomePage />;
    }
  };

  return (
    <div className="home-page">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      {renderPage()}
      <EmergencyAlert />
    </div>
  );
}