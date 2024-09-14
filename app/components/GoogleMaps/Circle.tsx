import { useEffect, useContext, useRef, forwardRef } from "react";
import { GoogleMapsContext, latLngEquals } from "@vis.gl/react-google-maps";

export type CircleProps = {
  center: google.maps.LatLngLiteral;
  radius?: number;
};

export type CircleRef = React.Ref<google.maps.Circle | null>;

function useCircle({ center, radius = 40000 }: CircleProps) {
  const circle = useRef(new google.maps.Circle()).current;

  useEffect(() => {
    if (center && !latLngEquals(center, circle.getCenter())) {
      circle.setCenter(center);
    }
    if (radius && radius !== circle.getRadius()) {
      circle.setRadius(radius);
    }
  }, [center, radius]);

  const map = useContext(GoogleMapsContext)?.map;

  useEffect(() => {
    if (!map) {
      console.error("<Circle> must be inside a Map component.");
      return;
    }

    const strokeColor = "#2196f3";
    const strokeWeight = 2;
    const fillColor = "#0000ff";
    const fillOpacity = 0.1;

    circle.setOptions({
      strokeColor,
      strokeWeight,
      fillColor,
      fillOpacity
    });

    circle.setMap(map);

    return () => {
      circle.setMap(null);
    };
  }, [map]);

  return circle;
}

export const Circle = forwardRef((props: CircleProps, ref: CircleRef) => {
  const circle = useCircle(props);

  return null;
});
