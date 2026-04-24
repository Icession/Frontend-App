import 'leaflet/dist/leaflet.css';
import "./Maps.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ETA from './ETA';

function Maps() {
    const position = [10.29470773468623, 123.88115009325371];

    return (
        <div style={{ position: "relative", height: "100vh", width: "100%" }}>
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        Current location
                    </Popup>
                </Marker>                   
            </MapContainer>
            <ETA startPosition={position} />
        </div>

    );  
}

export default Maps;