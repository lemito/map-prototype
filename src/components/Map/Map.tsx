"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Feature } from "geojson";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

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
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    mapInstance.addControl(draw);

    mapInstance.on("draw.create", (e: { features: Feature[] }) => {
      const feature = e.features[0];
      if (feature && feature.geometry.type === "Polygon") {
        setCoordinates(JSON.stringify(feature.geometry.coordinates));
      }
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <div>
      <div
        ref={mapContainerRef}
        id="map"
        className="map"
        style={{ width: "100%", height: "80vh" }}
      ></div>
      <div
        className="calculation-box"
        // style={{
        //   height: 75,
        //   width: 150,
        //   position: "absolute",
        //   bottom: 40,
        //   left: 10,
        //   backgroundColor: "rgba(255, 255, 255, 0.9)",
        //   padding: 15,
        //   textAlign: "center",
        // }}
      >
        <p style={{ color: "red" }}>Координаты</p>
        <div id="calculated-area">
          {coordinates || "Выделите область, чтобы увидеть координаты."}
        </div>
      </div>
    </div>
  );
};

export default MapBox;
