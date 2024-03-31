import { Component, Input, OnInit, signal } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Period } from '../../interfaces/responseInterface';
import { ChartConfigI } from '../../interfaces/chartConfigInterface';

@Component({
  selector: 'app-generic-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './generic-chart.component.html',
})
export class GenericChartComponent implements OnInit {
  @Input() chartConfig!: ChartConfigI;
  @Input() periodData!: Period[];

  chartType = signal<ChartType>('line');

  chartData = signal<ChartConfiguration['data']>({
    datasets: [],
  });

  chartOptions = signal<ChartConfiguration['options']>({
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  });

  data = signal<(number | null)[]>([]);

  ngOnInit(): void {
    const periods = this.periodData;
    const labels: string[] = periods.map(({ name }: Period) => name);
    const type: string = this.chartConfig.type;
    if (type === 'Temperature') {
      this.data.set(periods.map((data: Period) => data.temperature));
    }
    if (type === 'DewPoints') {
      this.data.set(periods.map((data: Period) => data.dewpoint.value));
    }
    if (type === 'Humidity') {
      this.data.set(periods.map((data: Period) => data.relativeHumidity.value));
    }
    if (type === 'WindSpeed') {
      this.data.set(
        periods.map(({ windSpeed }: Period) => parseInt(windSpeed))
      );
    }
    if (type === 'ProbabilityOfPrecipitation') {
      this.data.set(
        periods.map(
          ({ probabilityOfPrecipitation }: Period) =>
            probabilityOfPrecipitation.value || 0
        )
      );
    }

    this.chartData.set({
      datasets: [
        {
          data: this.data(),
          label: this.chartConfig.label,
          borderColor: this.chartConfig.borderColor,
          backgroundColor: this.chartConfig.backgroundColor,
        },
      ],
      labels: labels,
    });
  }
}
