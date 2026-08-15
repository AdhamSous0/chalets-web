"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLng } from "@/lib/data";

/**
 * خريطة موقع الشاليه — OpenStreetMap عبر Leaflet.
 * مجانية وبدون مفتاح API.
 *
 * لازم تتحمّل بالمتصفح فقط (Leaflet بلمس window)، فبتنستدعى
 * عبر next/dynamic مع ssr:false من صفحة التفاصيل.
 */

/** دبوس مرسوم بالكود — بلون التطبيق، وبيتفادى مشكلة صور Leaflet الافتراضية مع الحزم */
const pin = L.divIcon({
  className: "",
  html: `
    <span style="
      display:grid;place-items:center;
      width:34px;height:34px;
      background:var(--color-teal);
      border:3px solid #fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 3px 10px rgba(31,41,55,.35);
    ">
      <span style="
        width:9px;height:9px;background:#fff;border-radius:50%;
        transform:rotate(45deg);
      "></span>
    </span>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -32],
});

export default function ChaletMap({
  coords,
  name,
  city,
  height = 320,
  zoom = 14,
}: {
  coords: LatLng;
  name: string;
  city: string;
  height?: number;
  zoom?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-card border border-line"
      style={{ height }}
    >
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <Marker position={[coords.lat, coords.lng]} icon={pin}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
