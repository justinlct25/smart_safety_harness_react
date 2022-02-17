import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point, Polygon } from "geojson";
import { Map, MapMouseEvent } from "mapbox-gl";
import { MQTTHelmetMessage } from "./mqtt";

export function isMQTTHelmetMessage(msg: object): msg is MQTTHelmetMessage {
  return msg.hasOwnProperty("heartRate") && msg.hasOwnProperty("temperature") && msg.hasOwnProperty("moving") && msg.hasOwnProperty("fallen") && msg.hasOwnProperty("lngLat");
}

export function MQTTHelmetMessageToGeoJson(msg: MQTTHelmetMessage, id: string): Feature<Point, Omit<MQTTHelmetMessage, "lngLat"> & { inDanger: boolean }> {
  const { lngLat, ...rest } = msg;
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [msg.lngLat.lng, msg.lngLat.lat]
    },
    id: id,
    properties: {
      ...rest,
      inDanger: false
    }
  };
}

export type GeoJsonType = "FeatureCollection" | "draw.create" | "draw.update" | "draw.delete";

export function isMapboxFeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties>(obj: object): obj is MapboxFeatureCollection<G, P> {
  return obj.hasOwnProperty("features") && obj.hasOwnProperty("type") && Array.isArray((obj as any).features);
}

export interface MapboxFeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends Omit<FeatureCollection<G, P>, "type"> {
  type: GeoJsonType;
}

export interface MapFeatureMouseEvent<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends MapMouseEvent, Omit<FeatureCollection<G, P>, "type"> {
  feature: Feature<G, P>;
  map: Map;
}

export function pointInPolygon(point: Feature<Point>, vs: Feature<Polygon>) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
  
  const x = point.geometry.coordinates[0], y = point.geometry.coordinates[1];
  let inside = false;

  for (let i = 0, j = vs.geometry.coordinates[0].length - 1; i < vs.geometry.coordinates[0].length; j = i++) {
      const xi = vs.geometry.coordinates[0][i][0], yi = vs.geometry.coordinates[0][i][1];
      const xj = vs.geometry.coordinates[0][j][0], yj = vs.geometry.coordinates[0][j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  
  return inside;
};

export type ExcludeFunction<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]>;