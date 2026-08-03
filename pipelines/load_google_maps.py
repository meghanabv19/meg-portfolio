"""Google Maps Timeline batch load — manually triggered, re-runnable.

Parses a Google Takeout "Semantic Location History" export and keeps ONLY
tourist places: category in {TOURIST_ATTRACTION, MUSEUM, PARK, LANDMARK}
OR place-visit confidence > 0.8. Everything else (home, commute, daily
locations) is discarded and never written anywhere.

Output: raw.location_visits  (deduped on place_name + lat/lng)
        -> dbt builds mart.tourist_places from it.

Usage:
    python load_google_maps.py path/to/Semantic_Location_History/**/*.json
    # or a single combined file:
    python load_google_maps.py takeout.json
"""
from __future__ import annotations

import glob
import json
import sys

from _common import log, supabase

KEEP_CATEGORIES = {"TOURIST_ATTRACTION", "MUSEUM", "PARK", "LANDMARK"}
CONFIDENCE_THRESHOLD = 0.8


def e7(v: int | float | None) -> float | None:
    """Google stores lat/lng as int * 1e7."""
    if v is None:
        return None
    return v / 1e7 if abs(v) > 1000 else float(v)


def classify(place_visit: dict) -> str | None:
    """Return a category if this visit is a tourist place, else None."""
    loc = place_visit.get("location", {})
    sem_type = (loc.get("semanticType") or "").replace("TYPE_", "")
    if sem_type in KEEP_CATEGORIES:
        return sem_type

    # placeVisit-level category hints (schema varies across exports)
    for cat in place_visit.get("otherCandidateLocations", []):
        st = (cat.get("semanticType") or "").replace("TYPE_", "")
        if st in KEEP_CATEGORIES:
            return st

    conf = place_visit.get("placeVisitImportance")
    confidence = place_visit.get("visitConfidence")
    if isinstance(confidence, (int, float)) and confidence / 100.0 > CONFIDENCE_THRESHOLD:
        return "TOURIST_ATTRACTION" if conf == "MAIN" else "LANDMARK"
    return None


def parse_file(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as fh:
        blob = json.load(fh)

    out: list[dict] = []
    objects = blob.get("timelineObjects", blob if isinstance(blob, list) else [])
    for obj in objects:
        pv = obj.get("placeVisit")
        if not pv:
            continue
        category = classify(pv)
        if not category:
            continue
        loc = pv.get("location", {})
        lat, lng = e7(loc.get("latitudeE7")), e7(loc.get("longitudeE7"))
        name = loc.get("name")
        if not (name and lat and lng):
            continue
        address = loc.get("address", "") or ""
        city = address.split(",")[-3].strip() if address.count(",") >= 2 else (address.split(",")[0].strip() or "Unknown")
        country = address.split(",")[-1].strip() if "," in address else None
        visited = None
        dur = pv.get("duration", {})
        if dur.get("startTimestamp"):
            visited = dur["startTimestamp"][:10]
        out.append(
            {
                "place_name": name,
                "city": city,
                "country": country,
                "lat": lat,
                "lng": lng,
                "category": category,
                "visited_at": visited,
            }
        )
    return out


def dedupe(rows: list[dict]) -> list[dict]:
    """Keep earliest visit per (place_name, lat, lng)."""
    best: dict[tuple, dict] = {}
    for r in rows:
        key = (r["place_name"], round(r["lat"], 5), round(r["lng"], 5))
        if key not in best or (r["visited_at"] or "9999") < (best[key]["visited_at"] or "9999"):
            best[key] = r
    return list(best.values())


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    paths: list[str] = []
    for arg in sys.argv[1:]:
        paths.extend(glob.glob(arg, recursive=True) or [arg])

    all_rows: list[dict] = []
    for p in paths:
        try:
            rows = parse_file(p)
            all_rows.extend(rows)
            log(f"{p}: {len(rows)} tourist places")
        except Exception as exc:  # noqa: BLE001
            log(f"skip {p}: {exc}")

    rows = dedupe(all_rows)
    log(f"deduped to {len(rows)} unique places")

    if not rows:
        log("nothing to load")
        return

    sb = supabase()
    sb.schema("raw").table("location_visits").upsert(
        rows, on_conflict="place_name,lat,lng"
    ).execute()
    log(f"loaded {len(rows)} rows into raw.location_visits — run dbt to build mart.tourist_places")


if __name__ == "__main__":
    main()
