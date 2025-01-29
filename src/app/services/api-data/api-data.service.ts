import { Alert } from './../../interfaces/api-alert.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, timer } from 'rxjs';

const ALERT_INTERVAL = 30000;

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  constructor(private http: HttpClient) {}


  getAlerts(): Observable<Alert[]> {
    return timer(0, ALERT_INTERVAL).pipe(
      switchMap(() =>
        this.http.get<Alert[]>(
          '/api/Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=3'
        )
      )
    );
  }
}
