import { useState } from 'react';
import './ETA.css';

const API_URL = "http://localhost:8080/api/trips";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function ETA({ startPosition }) {
    const [originName, setOriginName] = useState('');
    const [originCoords, setOriginCoords] = useState(null);
    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
    const [selectedOrigin, setSelectedOrigin] = useState('');

    const [destinationName, setDestinationName] = useState('');
    const [destCoords, setDestCoords] = useState(null);
    const [destSuggestions, setDestSuggestions] = useState([]);
    const [showDestSuggestions, setShowDestSuggestions] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState('');

    const [eta, setEta] = useState(null);
    const [travelTime, setTravelTime] = useState(null);
    const [distance, setDistance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tripSaved, setTripSaved] = useState(false);

    const geocodeLocation = async (query) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            );
            return await response.json();
        } catch (err) {
            console.error('Geocoding error:', err);
            return [];
        }
    };

    const handleOriginChange = async (value) => {
        setOriginName(value);
        if (value.length > 2) {
            const results = await geocodeLocation(value);
            setOriginSuggestions(results);
            setShowOriginSuggestions(true);
        } else {
            setOriginSuggestions([]);
            setShowOriginSuggestions(false);
        }
    };

    const handleDestinationChange = async (value) => {
        setDestinationName(value);
        if (value.length > 2) {
            const results = await geocodeLocation(value);
            setDestSuggestions(results);
            setShowDestSuggestions(true);
        } else {
            setDestSuggestions([]);
            setShowDestSuggestions(false);
        }
    };

    const handleSelectOrigin = (location) => {
        const coords = { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
        setOriginCoords(coords);
        setOriginName(location.display_name);
        setSelectedOrigin(location.display_name);
        setOriginSuggestions([]);
        setShowOriginSuggestions(false);
    };

    const handleSelectDestination = (location) => {
        const coords = { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
        setDestCoords(coords);
        setDestinationName(location.display_name);
        setSelectedDestination(location.display_name);
        setDestSuggestions([]);
        setShowDestSuggestions(false);
    };

    const saveTripToBackend = async (tripData) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return; // Not logged in, skip saving

            const res = await fetch(API_URL, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(tripData),
            });

            if (res.ok) {
                setTripSaved(true);
            } else {
                console.warn("Trip save failed:", await res.text());
            }
        } catch (err) {
            console.warn("Could not save trip:", err.message);
        }
    };

    const calculateETA = async () => {
        if (!originCoords) { setError('Please select an origin location'); return; }
        if (!destCoords) { setError('Please select a destination location'); return; }

        setLoading(true);
        setError('');
        setTripSaved(false);

        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=false`
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                const durationSeconds = route.duration;
                const distanceMeters = route.distance;

                const minutes = Math.round(durationSeconds / 60);
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;

                const now = new Date();
                const arrivalTime = new Date(now.getTime() + durationSeconds * 1000);
                const etaString = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));

                setTravelTime({ hours, minutes: mins, total: minutes });
                setDistance(distanceKm);
                setEta(etaString);

                // Save trip to backend
                await saveTripToBackend({
                    origin: selectedOrigin,
                    originLat: originCoords.lat,
                    originLng: originCoords.lng,
                    destination: selectedDestination,
                    destinationLat: destCoords.lat,
                    destinationLng: destCoords.lng,
                    distanceKm: distanceKm,
                    travelTimeMinutes: minutes,
                    eta: etaString,
                });
            } else {
                setError('No route found. Please try different locations.');
            }
        } catch (err) {
            setError('Error calculating ETA. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setOriginName(''); setOriginCoords(null); setSelectedOrigin('');
        setOriginSuggestions([]); setShowOriginSuggestions(false);
        setDestinationName(''); setDestCoords(null); setSelectedDestination('');
        setDestSuggestions([]); setShowDestSuggestions(false);
        setEta(null); setTravelTime(null); setDistance(null);
        setError(''); setTripSaved(false);
    };

    return (
        <div className="eta-sidebar-container">
            <div className="eta-header">
                <h2>🚗 Route Planner</h2>
                <p className="eta-subtitle">Find Travel Time & Arrival</p>
            </div>

            <div className="eta-input-group">
                <label>📍 From (Origin)</label>
                <div className="eta-search-container">
                    <input
                        type="text"
                        placeholder="Search starting location..."
                        value={originName}
                        onChange={(e) => handleOriginChange(e.target.value)}
                        onFocus={() => originSuggestions.length > 0 && setShowOriginSuggestions(true)}
                    />
                    {originName && (
                        <button className="eta-clear-btn" onClick={() => { setOriginName(''); setOriginSuggestions([]); setShowOriginSuggestions(false); }}>✕</button>
                    )}
                    {showOriginSuggestions && originSuggestions.length > 0 && (
                        <div className="eta-suggestions">
                            {originSuggestions.map((location, index) => (
                                <button key={index} className="eta-suggestion-item" onClick={() => handleSelectOrigin(location)}>
                                    <span className="eta-location-icon">📍</span>
                                    <div className="eta-suggestion-text">
                                        <p className="eta-suggestion-name">{location.name || location.display_name.split(',')[0]}</p>
                                        <p className="eta-suggestion-address">{location.display_name.substring(0, 50)}...</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {selectedOrigin && <p className="eta-selected-location">✓ {selectedOrigin.substring(0, 55)}</p>}
            </div>

            <div className="eta-input-group">
                <label>🎯 To (Destination)</label>
                <div className="eta-search-container">
                    <input
                        type="text"
                        placeholder="Search destination..."
                        value={destinationName}
                        onChange={(e) => handleDestinationChange(e.target.value)}
                        onFocus={() => destSuggestions.length > 0 && setShowDestSuggestions(true)}
                    />
                    {destinationName && (
                        <button className="eta-clear-btn" onClick={() => { setDestinationName(''); setDestSuggestions([]); setShowDestSuggestions(false); }}>✕</button>
                    )}
                    {showDestSuggestions && destSuggestions.length > 0 && (
                        <div className="eta-suggestions">
                            {destSuggestions.map((location, index) => (
                                <button key={index} className="eta-suggestion-item" onClick={() => handleSelectDestination(location)}>
                                    <span className="eta-location-icon">📍</span>
                                    <div className="eta-suggestion-text">
                                        <p className="eta-suggestion-name">{location.name || location.display_name.split(',')[0]}</p>
                                        <p className="eta-suggestion-address">{location.display_name.substring(0, 50)}...</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {selectedDestination && <p className="eta-selected-location">✓ {selectedDestination.substring(0, 55)}</p>}
            </div>

            {error && <div className="eta-error">{error}</div>}

            <div className="eta-button-group">
                <button
                    className="eta-btn-primary"
                    onClick={calculateETA}
                    disabled={loading || !originCoords || !destCoords}
                >
                    {loading ? 'Calculating...' : 'Calculate Route'}
                </button>
                {eta && (
                    <button className="eta-btn-secondary" onClick={handleClear}>Reset</button>
                )}
            </div>

            {eta && (
                <div className="eta-results">
                    {tripSaved && (
                        <div style={{ fontSize: "12px", color: "#2e7d32", background: "rgba(46,125,50,0.08)", padding: "6px 10px", borderRadius: "6px", marginBottom: "8px" }}>
                            ✓ Trip saved to your history
                        </div>
                    )}
                    <div className="result-item">
                        <span className="result-label">⏱ Estimated Arrival</span>
                        <span className="result-value arrival-time">{eta}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">⏱ Travel Time</span>
                        <span className="result-value travel-time">
                            {travelTime.hours > 0 ? `${travelTime.hours}h ${travelTime.minutes}m` : `${travelTime.minutes}m`}
                        </span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">📏 Distance</span>
                        <span className="result-value distance">{distance} km</span>
                    </div>
                    {selectedOrigin && (
                        <div className="result-item">
                            <span className="result-label">From</span>
                            <span className="result-value destination">{selectedOrigin.substring(0, 40)}</span>
                        </div>
                    )}
                    {selectedDestination && (
                        <div className="result-item">
                            <span className="result-label">To</span>
                            <span className="result-value destination">{selectedDestination.substring(0, 40)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ETA; 