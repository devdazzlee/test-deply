"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin
} from "@vis.gl/react-google-maps";

interface GoogleMapsProps {
  position?: number[];
}

export default function GoogleMaps({ position }: GoogleMapsProps) {
  const marker = position ? { lat: position[0], lng: position[1] } : null;

  const usaBounds = {
    north: 49.384358,
    south: 24.396308,
    east: -66.93457,
    west: -125.0
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!}>
      <div className='h-[35vh] w-full'>
        <Map
          minZoom={marker ? 7 : 4}
          defaultBounds={usaBounds}
          defaultZoom={7}
          {...(marker && { center: marker })}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        >
          <AdvancedMarker position={marker}>
            <Pin />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}
