import { ApiDataService } from './../../services/api-data/api-data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as ol from 'ol';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { JsonDataService } from '../../services/json-data/json-data.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlarmDialogComponent } from '../alarm-dialog/alarm-dialog.component'; 
import { Subscription } from 'rxjs';
import { GeoJson, GeoJsonFeature } from '../../interfaces/geo-json.interface';
import { Alert } from '../../interfaces/api-alert.interface';
import { MapPoint } from '../../interfaces/map-point.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [MatDialogModule], 
})
export class MapComponent implements OnInit, OnDestroy {
  map!: ol.Map;
  currPoints: MapPoint[] = [];
  private pollingSubscription!: Subscription; 
  private isDialogOpen = false;

  constructor(
    private jsonDataService: JsonDataService,
    private apiDataService: ApiDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeMap();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  startPolling(): void {
    console.log('started polling');
    this.pollingSubscription = this.apiDataService
      .getAlerts()
      .subscribe((apiData: Alert[]) => {
        this.processApiData(apiData);
      });
  }

  processApiData(apiData: Alert[]): void {
    const pointsMap: Record<
      string,
      { coordinates: [number, number]; timestamps: string[] }
    > = {};
    const redAlerts = apiData.map((item) => ({
      cityName: item.data,
      timestamp: `${item.time} , ${item.date} `,
    }));

    this.jsonDataService.getCoordinates().subscribe((coordinates: GeoJson) => {
      coordinates.features.forEach((feature: GeoJsonFeature) => {
        const cityName = feature.properties.MGLSDE_LOC;
        const redAlertsInCity = redAlerts.filter(
          (redAlerts) => redAlerts.cityName === cityName
        );
        if (redAlertsInCity?.length > 0) {
          pointsMap[cityName] = {
            coordinates: feature.geometry.coordinates,
            timestamps: redAlertsInCity.map((redAlert) => redAlert.timestamp),
          };
        }
      });

     
      const newPoints = Object.keys(pointsMap).map((key) => ({
        key,
        coordinates: pointsMap[key].coordinates,
        timestamps: pointsMap[key].timestamps,
      }));
      
      if (!this.arePointsEqual(this.currPoints, newPoints)) {
        this.currPoints = newPoints;
        console.log('Fetched and grouped points:', this.currPoints);
        this.addPointssToMap();
      } else {
        console.log('No change in data, map not updated.');
      }
    });
  }

 
  arePointsEqual(oldPoints: MapPoint[], newPoints: MapPoint[]): boolean {
    return JSON.stringify(oldPoints) === JSON.stringify(newPoints);
  }

 
  initializeMap(): void {
    this.map = new ol.Map({
      target: 'map', 
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new ol.View({
        center: fromLonLat([34.7818, 32.0856]), // tel aviv
        zoom: 9.5,
      }),
    });
  }

 
  addPointssToMap(): void {
    const vectorSource = new VectorSource();

    this.currPoints.forEach((point) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(point.coordinates)),
        key: point.key,
        timestamps: point.timestamps,
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: 'assets/pics/map-pin.png',
            scale: 0.1,
          }),
        })
      );

      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map.addLayer(vectorLayer);

   
    this.map.on('click', (event) => {
      if (this.isDialogOpen) {
        return; //if one dialog is open , dont open another
      }
      console.log(this.isDialogOpen);
      this.map.forEachFeatureAtPixel(event.pixel, (featureLike, layer) => {
        // convert featureLike to Feature
        const feature = featureLike as Feature;

        if (feature) {
          const key = feature.get('key');
          const timestamps = feature.get('timestamps');
          if (key && timestamps) {
            this.isDialogOpen = true;
            // listenner to open dialog
            const dialogRef = this.dialog.open(AlarmDialogComponent, {
              data: {
                key,
                timestamps,
              },
            });
            // when dialog closes
            dialogRef.afterClosed().subscribe(() => {
              this.isDialogOpen = false;
            });
          } else {
            console.warn('Feature does not have expected properties:', feature);
          }
        }
        return true;
      });
      return false;
    });
  }
}
