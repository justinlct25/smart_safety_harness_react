import { LngLat } from "mapbox-gl";
import { ExcludeFunction } from "./utils";

export interface MQTTHelmetMessage {
  /**
   * Beats per minute
   */
  heartRate: number;
  /**
   * Celsius
   */
  temperature: number;
  IRvalue: number;
  moving: boolean;
  fallen: boolean;
  lngLat: ExcludeFunction<LngLat>;    // { lng: number, lat: number }
}