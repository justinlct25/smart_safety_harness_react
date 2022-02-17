// check this page for the complete instructions:
// https://developer.here.com/blog/geofencing-regions-with-javascript-and-here

class HereMap {
  constructor(mapElement) {
    this.platform = new H.service.Platform({
      apikey: "XjM5_adQ-rQeyuvleoDLvYJexLTYUwQwtbVPVvQiSa4", // api key for HERE
    });
    const maptypes = this.platform.createDefaultLayers();
    this.map = new H.Map(
      document.getElementById(mapElement),
      maptypes.vector.normal.map,
      {
        zoom: 17,
        center: { lat: 22.318886332808606, lng: 114.21721791812831 },
      }
    );

    const mapEvent = new H.mapevents.MapEvents(this.map);
    const behavior = new H.mapevents.Behavior(mapEvent);
    this.geofencing = this.platform.getGeofencingService();
    this.currentPosition = new H.map.Marker({
      lat: 22.318886332808606,
      lng: 114.21721791812831,
    });
    this.map.addObject(this.currentPosition);

    this.map.addEventListener(
      "tap",
      (ev) => {
        var target = ev.target;
        this.map.removeObject(this.currentPosition);
        this.currentPosition = new H.map.Marker(
          this.map.screenToGeo(
            ev.currentPointer.viewportX,
            ev.currentPointer.viewportY
          )
        );

        this.map.addObject(this.currentPosition);
        this.fenceRequest(["1234"], this.currentPosition.getGeometry()).then(
          (result) => {
            console.log(result);
            if (result.geometries.length > 0) {
              alert("You are within a geofence!");
            } else {
              alert("Not within a geofence!");
            }
          }
        );
      },
      false
    );
  }

  draw(mapObject) {
    this.map.addObject(mapObject);
  }

  polygonToWKT(polygon) {
    const geometry = polygon.getGeometry();
    return geometry.toString();
  }

  uploadGeofence(layerId, name, geometry) {
    const zip = new JSZip();
    zip.file("data.wkt", "NAME\tWKT\n" + name + "\t" + geometry);
    return zip.generateAsync({ type: "blob" }).then((content) => {
      var formData = new FormData();
      formData.append("zipfile", content);
      return axios.post(
        "https://fleet.ls.hereapi.com/2/layers/upload.json",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
          params: {
            apikey: "XjM5_adQ-rQeyuvleoDLvYJexLTYUwQwtbVPVvQiSa4", // api key for HERE
            layer_id: layerId,
          },
        }
      );
    });
  }

  fenceRequest(layerIds, position) {
    return new Promise((resolve, reject) => {
      this.geofencing.request(
        H.service.extension.geofencing.Service.EntryPoint.SEARCH_PROXIMITY,
        {
          layer_ids: layerIds,
          proximity: position.lat + "," + position.lng,
          geom: ["local"],
        },
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

// function to check current geolocation
function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.google.com/maps/place/${latitude}+${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
