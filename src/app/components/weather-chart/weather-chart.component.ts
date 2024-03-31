import { Component, inject, OnInit, signal } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WeatherService } from '../../services/weather.service';
import { ActivatedRoute } from '@angular/router';
import { ForecastResponse, Period } from '../../interfaces/responseInterface';
import { ChartConfigI } from '../../interfaces/chartConfigInterface';
import { GenericChartComponent } from '../generic-chart/generic-chart.component';

@Component({
  selector: 'app-weather-chart',
  standalone: true,
  imports: [BaseChartDirective, GenericChartComponent],
  templateUrl: './weather-chart.component.html',
})
export default class WeatherChartComponent implements OnInit {
  //injecting services
  public weatherService = inject(WeatherService);
  public route = inject(ActivatedRoute);

  // creating signals to use all data in just one chart
  weatherStation = signal<string>('');
  chartType = signal<ChartType>('line');
  oneChartData = signal<ChartConfiguration['data']>({
    datasets: [],
  });
  oneChartOptions = signal<ChartConfiguration['options']>({
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  });

  // signals to use in diferents charts BEST OPTION
  forecastDataPeriods = signal<Period[]>([]);
  chartsConfig = signal<ChartConfigI[]>([
    {
      type: 'Temperature',
      datakey: 'temperature',
      label: 'Temperature (°F)',
      borderColor: 'rgba(255,99,132)',
      backgroundColor: 'rgba(255,99,132,0.5)',
    },
    {
      type: 'DewPoints',
      datakey: 'dewPoints',
      label: 'DewPoint (°C)',
      borderColor: 'rgba(53,162,235)',
      backgroundColor: 'rgba(53,162,235,0.5)',
    },
    {
      type: 'Humidity',
      datakey: 'humidity',
      label: 'Humidity (%)',
      borderColor: 'rgba(75,192,192)',
      backgroundColor: 'rgba(75,192,192,0.5)',
    },
    {
      type: 'WindSpeed',
      datakey: 'windSpeed',
      label: 'Wind speed (mph)',
      borderColor: 'rgba(255,205,86)',
      backgroundColor: 'rgba(255,205,86,0.5)',
    },
    {
      type: 'ProbabilityOfPrecipitation',
      datakey: 'probabilityOfPrecipitation',
      label: 'Chance of Precipitation (%)',
      borderColor: 'rgba(201,203,207)',
      backgroundColor: 'rgba(201,203,207,0.5)',
    },
  ]);

  ngOnInit(): void {
    const station: string | null = this.route.snapshot.paramMap.get('station');

    if (!station) {
      console.error('Station parameter is missing');
      return;
    }

    this.weatherStation.set(station);

    this.weatherService.getForecast(station).subscribe({
      next: (data: ForecastResponse) => {
        this.forecastDataPeriods.set(data.properties.periods);

        const { periods } = data.properties;


        const temperatures: number[] = periods.map(
          ({ temperature }: Period) => temperature
        );

        const labels: string[] = periods.map(({ name }: Period) => name);

        const dewPoints: (number | null)[] = periods.map(
          ({ dewpoint }: Period) => dewpoint.value
        );

        const humidity: (number | null)[] = periods.map(
          ({ relativeHumidity }: Period) => relativeHumidity.value
        );

        const windSpeed: number[] = periods.map(({ windSpeed }: Period) =>
          parseInt(windSpeed)
        );

        const probabilityOfPrecipitation: (number | null)[] = periods.map(
          ({ probabilityOfPrecipitation }: Period) =>
            probabilityOfPrecipitation.value || 0
        );

        this.oneChartData.set({
          datasets: [
            {
              data: temperatures,
              label: 'Temperature (°F)',
              borderColor: 'rgba(255,99,132)',
              backgroundColor: 'rgba(255,99,132,0.5)',
              yAxisID: 'y',
            },
            {
              data: dewPoints,
              label: 'DewPoint (°C)',
              borderColor: 'rgba(53,162,235)',
              backgroundColor: 'rgba(53,162,235,0.5)',
              yAxisID: 'y1',
            },
            {
              data: humidity,
              label: 'Humidity (%)',
              borderColor: 'rgba(75,192,192)',
              backgroundColor: 'rgba(75,192,192,0.5)',
              yAxisID: 'y',
            },
            {
              data: windSpeed,
              label: 'Wind speed (mph)',
              borderColor: 'rgba(255,205,86)',
              backgroundColor: 'rgba(255,205,86,0.5)',
              yAxisID: 'y2',
            },
            {
              data: probabilityOfPrecipitation,
              label: 'Chance of Precipitation (%)',
              borderColor: 'rgba(201,203,207)',
              backgroundColor: 'rgba(201,203,207,0.5)',
              yAxisID: 'y',
            },
          ],
          labels,
        });
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
      },
    });
  }
}
