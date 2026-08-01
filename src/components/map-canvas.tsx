"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export function MapCanvas() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !container.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({ container: container.current, style: "mapbox://styles/mapbox/outdoors-v12", center: [0.12, 42.66], zoom: 8.2, attributionControl: false });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    return () => map.remove();
  }, []);
  return <div ref={container} aria-label="Mapa de aventuras" className="map-surface h-full w-full"/>;
}
