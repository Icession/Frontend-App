import { useEffect, useState } from "react";
import "./ETA.css";

function formatTravelTime(totalMinutes) {
  if (!totalMinutes && totalMinutes !== 0) {
    return "";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}min`;
}

function LocationSearch({ label, placeholder, value, active, onFocus, onSelect }) {
  const [keyword, setKeyword] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setKeyword(value?.name || "");
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (keyword.trim().length < 3 || keyword === value?.name) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const query = encodeURIComponent(`${keyword}, Cebu, Philippines`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=6&countrycodes=ph&viewbox=123.55,10.75,124.15,9.95&bounded=1`;
        const response = await fetch(url);
        const data = await response.json();

        setResults(
          data.map((item) => ({
            name: item.display_name,
            lat: Number(item.lat),
            lon: Number(item.lon)
          }))
        );
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, value]);

  const handleSelect = (place) => {
    onSelect(place);
    setKeyword(place.name);
    setResults([]);
  };

  return (
    <div className={`eta-search-block ${active ? "active" : ""}`}>
      <label>{label}</label>

      <input
        value={keyword}
        onFocus={onFocus}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
      />

      {(loading || results.length > 0) && (
        <div className="eta-suggestions">
          {loading && <div className="eta-loading">Searching Cebu locations...</div>}

          {results.map((place, index) => (
            <button key={`${place.name}-${index}`} onClick={() => handleSelect(place)}>
              <strong>{place.name.split(",")[0]}</strong>
              <span>{place.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ETA({
  origin,
  destination,
  pickMode,
  setPickMode,
  onSelectPoint,
  routeData,
  onFindRoute,
  onReset,
  loadingRoute,
  error,
  savedRoutes = [],
  onSaveRoute,
  onLoadSavedRoute,
  onDeleteSavedRoute
}) {
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (routeData) {
      setShowResults(true);
    }
  }, [routeData]);

  const handleFindRoute = async () => {
    const success = await onFindRoute();

    if (success) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    onReset();
  };

  const handleLoadSavedRoute = (route) => {
    onLoadSavedRoute(route);
    setShowResults(true);
  };

  return (
    <aside className="eta-sidebar-container">
      <div className="eta-header">
        <div>
          <h2>RideWatch ETA</h2>
          <p>Search Cebu routes and estimate arrival time</p>
        </div>
      </div>

      {!showResults && (
        <div className="eta-planner-card">
          <div className="eta-route-line">
            <span></span>
            <div></div>
            <span></span>
          </div>

          <div className="eta-form-area">
            <LocationSearch
              label="From"
              placeholder="Search starting location in Cebu..."
              value={origin}
              active={pickMode === "origin"}
              onFocus={() => setPickMode("origin")}
              onSelect={(place) => onSelectPoint("origin", place)}
            />

            <LocationSearch
              label="To"
              placeholder="Search destination in Cebu..."
              value={destination}
              active={pickMode === "destination"}
              onFocus={() => setPickMode("destination")}
              onSelect={(place) => onSelectPoint("destination", place)}
            />

            <div className="eta-option-row">
              <span>▦</span>
              <p>All modes selected</p>
            </div>

            <div className="eta-option-row">
              <span>◷</span>
              <p>Leaving now</p>
            </div>

            {error && <div className="eta-error">{error}</div>}

            <button className="eta-find-button" onClick={handleFindRoute} disabled={loadingRoute}>
              {loadingRoute ? "Finding Route..." : "Find Route"}
            </button>

            <button className="eta-reset-button" onClick={handleReset}>
              Reset
            </button>

            <p className="eta-helper-text">
              You may also click directly on the map. First click is origin, second click is destination.
            </p>
          </div>
        </div>
      )}

      {showResults && routeData && (
        <div className="eta-results-panel">
          <div className="eta-results-header">
            <button onClick={() => setShowResults(false)}>←</button>

            <div>
              <strong>Route Summary</strong>
              <span>OSRM-calculated result</span>
            </div>

            <button onClick={handleFindRoute}>Refresh</button>
          </div>

          <div className="eta-summary-card">
            <div className="eta-summary-item">
              <span>Arrival</span>
              <strong>{routeData.arrivalTime}</strong>
            </div>

            <div className="eta-summary-item">
              <span>Travel</span>
              <strong>{formatTravelTime(routeData.durationMin)}</strong>
            </div>

            <div className="eta-summary-item">
              <span>Distance</span>
              <strong>{routeData.distanceKm} km</strong>
            </div>
          </div>

          <button className="eta-save-button" onClick={onSaveRoute}>
            Save Route
          </button>

          <button className="eta-reset-button bottom" onClick={handleReset}>
            Reset Planner
          </button>
        </div>
      )}

      {savedRoutes.length > 0 && (
        <div className="eta-history-section">
          <div className="eta-history-header">
            <h3>Route History</h3>
            <span>{savedRoutes.length} saved</span>
          </div>

          <div className="eta-history-list">
            {savedRoutes.map((route) => (
              <div className="eta-history-card" key={route.id}>
                <div className="eta-history-info">
                  <strong>{route.origin?.name?.split(",")[0] || "Origin"}</strong>
                  <span>to</span>
                  <strong>{route.destination?.name?.split(",")[0] || "Destination"}</strong>

                  <p>
                    {formatTravelTime(route.routeData?.durationMin)} • {route.routeData?.distanceKm} km
                  </p>

                  <small>{route.savedAt}</small>
                </div>

                <div className="eta-history-actions">
                  <button onClick={() => handleLoadSavedRoute(route)}>Go</button>
                  <button onClick={() => onDeleteSavedRoute(route.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default ETA;