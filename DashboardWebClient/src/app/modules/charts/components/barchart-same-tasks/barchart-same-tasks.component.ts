import { Component, ViewChild, ElementRef, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartBase } from '../../shared/chart-base.class';
import { Chart } from 'chart.js/auto';
import { TaskData } from '../../../tasks/shared/models/task-data.model';

import { ChartConfiguration, ChartData, BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip } from 'chart.js';
import { calculateAverageTime } from '../../../utils/avg-time-calculator';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip);

@Component({
  selector: 'app-barchart-same-tasks',
  templateUrl: './barchart-same-tasks.component.html',
  styles: ``
})
export class BarchartSameTasksComponent extends ChartBase {

  taskData: TaskData[] = [];
  chartLabelSet: any;
  chartDataSet: any;
  taskDates: any[] = [];
  isLoading = false;
  datePipe = inject(DatePipe);
  currentDate = new Date();
  requestDate: string | null  = '';

  isChangeTaskDataSubscribtion!: Subscription;

  @ViewChild('chart', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;
  constructor(private taskService: TaskService) {
    super();
  }

  ngOnInit() {
    this.loadDataForWeek();

    this.isChangeTaskDataSubscribtion = this.taskService.changeTaskData$.subscribe(result => {
      if (result) {
        this.loadDataForWeek();
      }
    })
  }

  formationConfig() {
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.chartLabelSet,
        datasets: this.chartDataSet
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
            stacked: false,
          },
          y: {
            stacked: false,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Количество обращений'
            },
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    return config;
  }

  createDataSet() {
    this.isLoading = true;
    this.taskService.getTasks(this.requestDate).subscribe({
      next: result => {
        if (Array.isArray(result)) {
          this.taskData = result;

          this.taskDates = this.taskData.map(data => data.startTaskDate);

          const taskTitles = this.taskData.map(item => item.title);
          const duplicateTaskTitles = taskTitles.filter((value, index, array) => {
            return array.indexOf(value) !== index && array.lastIndexOf(value) === index;
          })

          const uniqueTaskData = this.taskData.filter(x => duplicateTaskTitles.includes(x.title) && this.taskDates.includes(x.startTaskDate));
          const systems = uniqueTaskData.map(item => item.systemSectionName);
          const uniqueSystems = systems.filter((value, index, array) => {
            return array.indexOf(value) === index;
          })

          const dataSets = uniqueSystems.map(system => {
            const systemData = duplicateTaskTitles.map(title => {
              const item = uniqueTaskData.map(d => d.systemSectionName === system && d.title === title && this.taskDates.includes(d.startTaskDate));
              return item.reduce((acc, val) => val ? acc + 1 : acc, 0);
            })

            return {
              label: system,
              data: systemData
            }
          })

          this.chartLabelSet = duplicateTaskTitles;
          this.chartDataSet = dataSets;
          const config = this.formationConfig();
          this.updateChartData(this.chartCanvas.nativeElement, config);
        }

        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.errorModal.openModal(err);
      }
    })
  }



  loadDataForWeek() {
    this.destroyChart();

    const getDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7, 0, 0, 0);
    this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss");

    this.createDataSet();
  }

  loadDataForYear() {
    this.destroyChart();

    const getDate = new Date(this.currentDate.getFullYear(), 0, 1);
    this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss")

    this.createDataSet();
  }

  ngOnDestroy() {
    this.isChangeTaskDataSubscribtion.unsubscribe();
  }
}
