import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { TaskData } from '../../tasks/shared/models/task-data.model';
import { DatePipe } from '@angular/common';

export abstract class ChartBase {
  public chart!: Chart;

  public updateChartData(canvas: HTMLCanvasElement, newConfig: ChartConfiguration): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, newConfig);
    this.chart.update();
  }

  public destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
