import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import MarkerClusterGroup from "react-leaflet-markercluster"; // ✅ use stable package

// Fix Leaflet default marker issue in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Handles map recentering
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) map.setView(center);
  }, [center, map]);
  return null;
}

// Cluster layer, safe inside map context
function ClusterLayer({ markers, markerRefs, onMarkerClick }) {
  useMap(); // ensures map context is ready

  const clusterIcon = (cluster) =>
    L.divIcon({
      html: `<div class="cluster-marker">${cluster.getChildCount()}</div>`,
      className: "custom-cluster-icon",
      iconSize: L.point(44, 44, true),
    });

  if (!markers?.length) return null;

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={clusterIcon}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
    >
      {markers.map((p) => (
        <Marker
          key={p._id}
          position={[p.lat, p.lng]}
          ref={(ref) => {
            if (ref) markerRefs.current[p._id] = ref;
          }}
          eventHandlers={{ click: () => onMarkerClick && onMarkerClick(p) }}
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                ₹{p.rent} {p.properttyType ? `• ${p.properttyType}` : ""}
              </div>
              <div style={{ fontSize: 12, color: "#444" }}>
                {p.address || `${p.city || ""} ${p.state || ""}`}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

export default function SearchResultsMap({
  properties,
  center,
  selectedPropertyId,
  onMarkerClick,
}) {
  const markerRefs = useRef({});

  useEffect(() => {
    if (!selectedPropertyId) return;
    const mk = markerRefs.current[selectedPropertyId];
    if (mk?.openPopup) mk.openPopup();
  }, [selectedPropertyId]);

  // Normalize property lat/lng
  const markers = useMemo(
    () =>
      (properties || [])
        .map((p) => {
          const lat =
            typeof p.latitude === "string" ? parseFloat(p.latitude) : p.latitude;
          const lng =
            typeof p.longitude === "string" ? parseFloat(p.longitude) : p.longitude;
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return { ...p, lat, lng };
        })
        .filter(Boolean),
    [properties]
  );

  const fallbackCenter = useMemo(() => {
    if (Array.isArray(center) && center.length === 2) return center;
    if (markers.length) return [markers[0].lat, markers[0].lng];
    return [19.076, 72.8777]; // Mumbai default
  }, [center, markers]);

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-80px)] rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={fallbackCenter}
        zoom={12}
        scrollWheelZoom
        preferCanvas
        className="w-full h-full"
      >
        <RecenterMap center={fallbackCenter} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ cluster layer inside map */}
        <ClusterLayer
          markers={markers}
          markerRefs={markerRefs}
          onMarkerClick={onMarkerClick}
        />
      </MapContainer>
    </div>
  );
}
