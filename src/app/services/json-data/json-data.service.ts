import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoJson } from '../../interfaces/geo-json.interface';

@Injectable({
  providedIn: 'root',
})
export class JsonDataService {
  private geoJsonUrl = 'assets/cities.geojson';

  constructor(private http: HttpClient) {}

  getCoordinates(): Observable<GeoJson> {
    return this.http.get<GeoJson>(this.geoJsonUrl);
  }
}  