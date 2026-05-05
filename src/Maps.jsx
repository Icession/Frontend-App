import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Maps.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  ZoomControl,
  useMap
} from "react-leaflet";
import ETA from "./ETA";

const cebuCenter = [10.29470773468623, 123.88115009325371];

const startMarkerIcon = L.divIcon({
  className: "custom-route-marker",
  html: `
    <div class="route-marker route-marker-start">
      <div class="route-marker-label">Start</div>
      <div class="route-marker-dot"></div>
    </div>
  `,
  iconSize: [70, 60],
  iconAnchor: [35, 52]
});

const endMarkerIcon = L.divIcon({
  className: "custom-route-marker",
  html: `
    <div class="route-marker route-marker-end">
      <div class="route-marker-label">End</div>
      <div class="route-marker-dot"></div>
    </div>
  `,
  iconSize: [70, 60],
  iconAnchor: [35, 52]
});

function MapClickHandler({ pickMode, onPick }) {
  useMapEvents({
    click(e) {
      onPick(pickMode, {
        name: `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`,
        lat: e.latlng.lat,
        lon: e.latlng.lng
      });
    }
  });

  return null;
}

function RouteAutoFit({ routeLine, origin, destination }) {
  const map = useMap();

  useEffect(() => {
    if (routeLine.length > 0) {
      map.fitBounds(routeLine, {
        padding: [70, 70]
      });
      return;
    }

    if (origin && destination) {
      map.fitBounds(
        [
          [origin.lat, origin.lon],
          [destination.lat, destination.lon]
        ],
        {
          padding: [70, 70]
        }
      );
    }
  }, [map, routeLine, origin, destination]);

  return null;
}

function CurrentLocationButton({ onFoundLocation }) {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const findMyLocation = () => {
    if (!navigator.geolocation) {
      onFoundLocation(null, "Your browser does not support location services.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const place = {
          name: "My Current Location",
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };

        map.setView([place.lat, place.lon], 16);
        onFoundLocation(place, "");
        setLocating(false);
      },
      () => {
        onFoundLocation(null, "Location permission was denied or unavailable.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <button className="current-location-btn" onClick={findMyLocation} title="Find my location">
      {locating ? "..." : "⌖"}
    </button>
  );
}

function Maps() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickMode, setPickMode] = useState("origin");
  const [routeLine, setRouteLine] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");

  const [savedRoutes, setSavedRoutes] = useState(() => {
    try {
      const storedRoutes = localStorage.getItem("ridewatch_saved_routes");
      return storedRoutes ? JSON.parse(storedRoutes) : [];
    } catch {
      return [];
    }
  });

  const handleSelectPoint = (mode, place) => {
    if (mode === "origin") {
      setOrigin(place);
      setPickMode("destination");
    } else {
      setDestination(place);
    }

    setRouteLine([]);
    setRouteData(null);
    setError("");
  };

  const handleFoundLocation = (place, message) => {
    if (message) {
      setError(message);
      return;
    }

    setOrigin(place);
    setPickMode("destination");
    setRouteLine([]);
    setRouteData(null);
    setError("");
  };

  const findRoute = async () => {
    if (!origin || !destination) {
      setError("Please select your origin and destination first.");
      return false;
    }

    setLoadingRoute(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/osrm/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          origin: {
            latitude: origin.lat,
            longitude: origin.lon
          },
          destination: {
            latitude: destination.lat,
            longitude: destination.lon
          }
        })
      });

      if (!response.ok) {
        setError("RideWatch routing server returned an error.");
        return false;
      }

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        setError("No route found. Please choose locations closer to roads in Cebu.");
        return false;
      }

      const route = data.routes[0];
      const line = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const durationMin = Math.round(route.duration / 60);
      const distanceKm = (route.distance / 1000).toFixed(2);
      const arrival = new Date(Date.now() + route.duration * 1000);

      setRouteLine(line);
      setRouteData({
        distanceKm,
        durationMin,
        arrivalTime: arrival.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      });

      return true;
    } catch {
      setError("Unable to connect to the RideWatch routing server.");
      return false;
    } finally {
      setLoadingRoute(false);
    }
  };

  const saveCurrentRoute = () => {
    if (!origin || !destination || !routeData || routeLine.length === 0) {
      setError("Please find a route first before saving.");
      return;
    }

    const isDuplicate = savedRoutes.some(
      (route) =>
        route.origin?.lat === origin.lat &&
        route.origin?.lon === origin.lon &&
        route.destination?.lat === destination.lat &&
        route.destination?.lon === destination.lon
    );

    if (isDuplicate) {
      setError("This route is already saved in your route history.");
      return;
    }

    const newSavedRoute = {
      id: Date.now(),
      origin,
      destination,
      routeData,
      routeLine,
      savedAt: new Date().toLocaleString()
    };

    const updatedRoutes = [newSavedRoute, ...savedRoutes].slice(0, 10);

    setSavedRoutes(updatedRoutes);
    localStorage.setItem("ridewatch_saved_routes", JSON.stringify(updatedRoutes));
    setError("");
  };

  const loadSavedRoute = (savedRoute) => {
    setOrigin(savedRoute.origin);
    setDestination(savedRoute.destination);
    setRouteData(savedRoute.routeData);
    setRouteLine(savedRoute.routeLine);
    setPickMode("destination");
    setError("");
  };

  const deleteSavedRoute = (routeId) => {
    const updatedRoutes = savedRoutes.filter((route) => route.id !== routeId);

    setSavedRoutes(updatedRoutes);
    localStorage.setItem("ridewatch_saved_routes", JSON.stringify(updatedRoutes));
  };

  const resetPlanner = () => {
    setOrigin(null);
    setDestination(null);
    setPickMode("origin");
    setRouteLine([]);
    setRouteData(null);
    setError("");
    setLoadingRoute(false);
  };

  return (
    <div className="maps-page">
      <MapContainer
        center={cebuCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="maps-leaflet"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <ZoomControl position="topright" />
        <CurrentLocationButton onFoundLocation={handleFoundLocation} />

        <MapClickHandler pickMode={pickMode} onPick={handleSelectPoint} />
        <RouteAutoFit routeLine={routeLine} origin={origin} destination={destination} />

        {origin && (
          <Marker position={[origin.lat, origin.lon]} icon={startMarkerIcon}>
            <Popup>Origin: {origin.name}</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={[destination.lat, destination.lon]} icon={endMarkerIcon}>
            <Popup>Destination: {destination.name}</Popup>
          </Marker>
        )}

        {routeLine.length > 0 && (
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: "#8b0000",
              weight: 6,
              opacity: 0.9
            }}
          />
        )}
      </MapContainer>

      <ETA
        origin={origin}
        destination={destination}
        pickMode={pickMode}
        setPickMode={setPickMode}
        onSelectPoint={handleSelectPoint}
        routeData={routeData}
        onFindRoute={findRoute}
        onReset={resetPlanner}
        loadingRoute={loadingRoute}
        error={error}
        savedRoutes={savedRoutes}
        onSaveRoute={saveCurrentRoute}
        onLoadSavedRoute={loadSavedRoute}
        onDeleteSavedRoute={deleteSavedRoute}
      />
    </div>
  );
}

export default Maps;