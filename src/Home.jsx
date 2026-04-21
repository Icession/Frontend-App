import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import About from "./About";
import Faq from "./Faq";
import Account from "./Account";
import Maps from "./Maps";

function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

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
            <button className="btn-routes" onClick={() => navigate('/maps')}>Maps</button>
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
    case "Home": return <HomePage />;
    case "About": return <About />;
    case "F.A.Q": return <Faq />;
    case "Account": return <Account />;
    case "Maps": return <Maps />;
    default: return <HomePage />;
  }
};

  return (
    <div className="home-page">
      {renderPage()}
    </div>
  );
}