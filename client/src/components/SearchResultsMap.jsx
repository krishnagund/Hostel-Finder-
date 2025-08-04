import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to update the center manually
function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
}

export default function SearchResultsMap({ properties, center }) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
      <RecenterMap center={center} />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property, index) => {
        const { latitude, longitude, heading } = property;

        if (
          typeof latitude === 'number' &&
          typeof longitude === 'number' &&
          !isNaN(latitude) &&
          !isNaN(longitude)
        ) {
          return (
            <Marker key={index} position={[latitude, longitude]}>
              <Popup>{heading || 'Unnamed Property'}</Popup>
            </Marker>
          );
        } else {
          return null;
        }
      })}
    </MapContainer>
  );
}
