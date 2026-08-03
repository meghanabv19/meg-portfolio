"use client";

import { useEffect, useRef, useState } from "react";
import type { TouristPlace } from "@/lib/types";
import { SectionHeader, FallbackNote } from "../ui";

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

export default function MapsSection({
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
          center: { lat: 48.5, lng: 2.0 },
          zoom: 4,
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

        // MarkerClusterer (global from the unpkg script)
        if (window.markerClusterer?.MarkerClusterer) {
          new window.markerClusterer.MarkerClusterer({ map, markers });
        } else {
          markers.forEach((m: any) => m.setMap(map));
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

  const cities = Array.from(new Set(data.map((p) => p.city)));

  return (
    <section>
      <SectionHeader
        title="maps"
        subtitle={`${data.length} tourist places across ${cities.length} cities · reads mart.tourist_places`}
      />

      <FallbackNote show={places.usedFallback} source="Google Maps" />

      {apiKey && status !== "error" ? (
        <div
          ref={ref}
          className="h-[420px] w-full overflow-hidden rounded-md border border-border bg-panel"
          aria-label="Map of visited tourist places"
        />
      ) : (
        // Graceful fallback when no Maps API key is configured.
        <div className="rounded-md border border-border bg-panel p-4">
          <div className="mb-3 text-xs text-muted">
            {apiKey
              ? "Map failed to load — showing place list."
              : "Google Maps key not configured — showing place list. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to render the interactive dark map."}
          </div>
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

      <p className="mt-4 text-xs italic text-muted">
        Only tourist places are plotted — museums, parks, landmarks and attractions. No home, no
        commute, no daily locations. Raw location history is never stored on this server.
      </p>
    </section>
  );
}
