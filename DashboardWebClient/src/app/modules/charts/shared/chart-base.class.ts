import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { TaskData } from '../../tasks/shared/models/task-data.model';

export abstract class ChartBase {
  public chart!: Chart;

  abstract createDataSet(): void;

  public updateChartData(canvas: HTMLCanvasElement, newConfig: ChartConfiguration): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, newConfig);
    this.chart.update();
  }

  public destroyChart(): void {
    this.chart.destroy();
  }

}
