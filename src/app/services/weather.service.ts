import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForecastResponse } from '../interfaces/responseInterface';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);

  getForecast(station: string): Observable<ForecastResponse> {
    const url = `https://api.weather.gov/gridpoints/${station}/31,80/forecast`;

    return this.http.get<ForecastResponse>(url);
  }
}
