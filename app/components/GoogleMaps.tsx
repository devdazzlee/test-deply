"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Circle } from "./GoogleMaps/Circle";

interface GoogleMapsProps {
  position?: string[]; // Latitude and longitude
  miles?: number; // Radius in miles
}

export default function GoogleMaps({ position, miles }: GoogleMapsProps) {
  const marker = position
    ? { lat: Number(position[0]), lng: Number(position[1]) }
    : null;

  const usaBounds = {
    north: 49.384358,
    south: 24.396308,
    east: -66.93457,
    west: -125.0
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!}>
      <div className="h-[35vh] w-full">
        <Map
          defaultZoom={8}
          minZoom={marker ? 7 : 4}
          defaultBounds={usaBounds}
          gestureHandling={"greedy"}
          {...(marker && { center: marker })}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        >
          {marker && (
            <>
              {/* Render the marker */}
              <Circle center={marker} radius={(miles || 0) * 1609.34} />
            </>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
