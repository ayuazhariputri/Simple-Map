import { Component, OnInit } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map'
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic'
import Point from '@arcgis/core/geometry/Point'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mapView!: MapView;
  userLocationGraphic!: Graphic;

  /*latitude!: number;
  longitude!: number;*/
  constructor() { }

  //Pengaturan dari ngOnIt
  public async ngOnInit() {
    //throw new Error("Method not implemented.")
    /*this.longitude = 126.98761097831427;
    this.latitude = 37.54965776569719;
    /*const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;*/
    const map = new Map({
      basemap: 'satellite' 
      //topo-vector, gray-vector, satellite
    });
    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 8,
      //center: [this.longitude, this.latitude]
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  //Pengaturan getLocationService
  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  //Pengaturan UpdateUserLocationOnMap
  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);

      // Tambahkan marker baru berdasarkan koordinat tertentu
      const markerGeom = new Point({
        latitude: targetLatitude,
        longitude: targetLongitude,
      });
      const markerGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: markerGeom,
      });
      this.mapView.graphics.add(markerGraphic);
    }
  }
}
const WeatherServiceUrl =
  'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'

const targetLatitude = 40.47718879105866;
const targetLongitude = -77.68188531930174;