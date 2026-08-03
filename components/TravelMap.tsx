"use client";

import { useEffect, useRef, useState } from "react";
import type { TouristPlace } from "@/lib/types";
import { FallbackNote } from "./ui";

type W<T> = { data: T; usedFallback: boolean };

// Dark map style tuned for the terminal aesthetic.
const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0f0f12" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b6b73" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#08131a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1f" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1e1e22" }] },
];

declare global {
  interface Window {
    google?: any;
    markerClusterer?: any;
  }
}

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const el = document.createElement("script");
    el.id = id;
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(el);
  });
}

// Embeddable travel map (used inside the Personal section).
export default function TravelMap({
  places,
  apiKey,
}: {
  places: W<TouristPlace[]>;
  apiKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const data = places.data;

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    setStatus("loading");

    (async () => {
      try {
        await loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`,
          "gmaps-js",
        );
        await loadScript(
          "https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js",
          "gmaps-clusterer",
        );
        if (cancelled || !ref.current || !window.google) return;

        const map = new window.google.maps.Map(ref.current, {
          center: { lat: 51.5, lng: -0.2 },
          zoom: 10,
          styles: DARK_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: "#0a0a0b",
        });

        const info = new window.google.maps.InfoWindow();
        const markers = data.map((p) => {
          const marker = new window.google.maps.Marker({
            position: { lat: p.lat, lng: p.lng },
            title: p.place_name,
          });
          marker.addListener("click", () => {
            info.setContent(
              `<div style="font-family:monospace;color:#111;min-width:160px">
                 <strong>${p.place_name}</strong><br/>
                 ${p.city}${p.country ? ", " + p.country : ""}<br/>
                 <span style="color:#555">first visited ${new Date(
                   p.first_visited,
                 ).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
               </div>`,
            );
            info.open(map, marker);
          });
          return marker;
        });

        if (window.markerClusterer?.MarkerClusterer) {
          new window.markerClusterer.MarkerClusterer({ map, markers });
        } else {
          markers.forEach((m: any) => m.setMap(map));
        }

        const bounds = new window.google.maps.LatLngBounds();
        data.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 64);
          window.google.maps.event.addListenerOnce(map, "idle", () => {
            if (map.getZoom() > 13) map.setZoom(13);
          });
        }

        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiKey, data]);

  return (
    <div>
      <FallbackNote show={places.usedFallback} source="travel" />

      {apiKey && status !== "error" ? (
        <div
          ref={ref}
          className="h-[380px] w-full overflow-hidden rounded-md border border-border bg-panel"
          aria-label="Map of places visited"
        />
      ) : (
        <div className="rounded-md border border-border bg-panel p-4">
          <ul className="grid gap-2 sm:grid-cols-2">
            {data.map((p) => (
              <li key={p.place_name} className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-1 text-xs">
                <span>
                  <span className="text-fg">{p.place_name}</span>
                  <span className="text-muted"> · {p.city}</span>
                </span>
                <span className="shrink-0 text-[10px] text-muted/70">
                  {new Date(p.first_visited).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-[11px] italic text-muted">
        Places I&apos;ve explored since moving to the UK — landmarks, parks and attractions only. No
        home, commute or daily locations; raw location history is never stored on this server.
      </p>
    </div>
  );
}
