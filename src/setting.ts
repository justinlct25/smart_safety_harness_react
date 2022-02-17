export const drawControlSetting = [
  {
    id: "gl-draw-corner",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"]],
    paint: { "circle-color": "#ff0000", "circle-radius": 6 },
  },
  {
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: { "fill-color": "#ff0000", fillOpacity: 0.3 },
  },
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: { "circle-color": "#ff0000", "circle-radius": 3 },
  },
];
