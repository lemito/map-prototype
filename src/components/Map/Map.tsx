"use client"
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Feature } from "geojson";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const DrawRectangleMode = {
  onSetup(): unknown {
    const rectangle = this.newFeature({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[]],
      },
    });

    this.addFeature(rectangle);

    return {
      rectangle,
      startPoint: null,
      currentPoint: null,
    };
  },

  onMouseDown(state: any, e: any) {
    state.startPoint = [e.lngLat.lng, e.lngLat.lat];
  },

  onMouseMove(state: any, e: any) {
    if (!state.startPoint) return;

    state.currentPoint = [e.lngLat.lng, e.lngLat.lat];
    const [startLng, startLat] = state.startPoint;
    const [endLng, endLat] = state.currentPoint;

    const coordinates = [
      [startLng, startLat],
      [endLng, startLat],
      [endLng, endLat],
      [startLng, endLat],
      [startLng, startLat],
    ];

    state.rectangle.setCoordinates([coordinates]);
  },

  onMouseUp(state: any) {
    this.changeMode("simple_select", { featureIds: [state.rectangle.id] });
  },

  toDisplayFeatures(state: unknown, geojson: unknown, display: unknown) {
    display(geojson);
  },
};

const MapBox: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<string>("");

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [37.6173, 55.7558],
      zoom: 10,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        trash: true,
      },
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle: DrawRectangleMode, 
      },
    });

    mapInstance.addControl(draw);

    const drawRectangle = () => {
      draw.changeMode("draw_rectangle");
    };

    mapInstance.on("draw.create", (e: { features: Feature[] }) => {
      const feature = e.features[0];
      if (feature && feature.geometry.type === "Polygon") {
        setCoordinates(JSON.stringify(feature.geometry.coordinates));
      }
    });

    const button = document.createElement("button");
    button.textContent = "Рисовать прямоугольник";
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.left = "10px";
    button.style.zIndex = "1000";
    button.style.padding = "10px";
    button.style.background = "white";
    button.style.cursor = "pointer";
    button.onclick = drawRectangle;
    mapContainerRef.current.appendChild(button);

    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "80vh", position: "relative" }}
      />
      <div
        style={{ padding: "10px", background: "#f0f0f0", marginTop: "10px" }}
      >
        <h4>Координаты выделенной области:</h4>
        <pre>
          {coordinates || "Выделите область, чтобы увидеть координаты."}
        </pre>
      </div>
    </div>
  );
};

export default MapBox;
