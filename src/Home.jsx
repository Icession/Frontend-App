import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import About from "./About";
import Faq from "./Faq";
import Account from "./Account";
import Maps from "./Maps";
import Sampledata from "./RouteSampledata";

function HomePage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      setSearchResults([]);
      setSearched(false);
      return;
    }
    
    const results = Sampledata.filter((route) =>
      route.destination.toLowerCase().includes(query.toLowerCase()) ||
      route.origin.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setSearched(true);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setSearched(false);
  };

  const handleRouteSelected = (route) => {
    navigate('/maps', { state: { location: route.destination, coords: route.destinationCoords } });
  };

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
                <svg className="search-icon" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <input
                  type="text"
                  placeholder="Search for routes"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="btn-search" onClick={handleSearch}>Search</button>
            </div>
            {searched && (
              <div className="search-results">
                <button className="btn-clear" onClick={handleClearSearch}>Clear</button>
                {searchResults.length > 0 ? (
                  <div className="results-list">
                    <p className="results-count">{searchResults.length} route(s) found</p>
                    {searchResults.map((route, index) => (
                      <div key={index} className="result-item" onClick={() => handleRouteSelected(route)} style={{ cursor: 'pointer' }}>
                        <p><strong>{route.origin}</strong> → <strong>{route.destination}</strong></p>
                        <p className="route-info">{route.distance} | {route.duration}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-results">No routes found for "{query}"</p>
                )}
              </div>
            )}
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