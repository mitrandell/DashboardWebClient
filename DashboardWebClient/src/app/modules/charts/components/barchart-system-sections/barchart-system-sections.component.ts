import { Component, ViewChild, ElementRef, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { ChartBase } from '../../shared/chart-base.class';
import { Chart } from 'chart.js/auto';
import { TaskData } from '../../../tasks/shared/models/task-data.model';
import { ChartConfiguration, ChartData, BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip } from 'chart.js';
import { calculateAverageTime } from '../../../utils/avg-time-calculator';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip);

@Component({
  selector: 'app-barchart-system-sections',
  templateUrl: './barchart-system-sections.component.html',
  styles: ``
})
export class BarchartSystemSectionsComponent extends ChartBase implements OnInit, OnDestroy {

  taskData: TaskData[] = [];
  chartLabelSet: any;
  chartDataSet: any;
  isLoading = false;

  currentDate = new Date();
  defaultRequestDate = new Date().setDate(this.currentDate.getDate() - 8);
  requestDate = this.defaultRequestDate;

  isChangeTaskDataSubscribtion!: Subscription;

  @ViewChild('chart', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private taskService: TaskService) {
    super();
  }

  ngOnInit() {
    this.createDataSet();

    this.isChangeTaskDataSubscribtion = this.taskService.changeTaskData$.subscribe(result => {
      if (result) {
        this.createDataSet();
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

          const labels: string[] = this.taskData.map(data => data.startTaskDate);

          var uniqueLabels = labels.filter((value, index, array) => {
            return array.indexOf(value) === index;
          })

          this.chartLabelSet = uniqueLabels;

          const systems = this.taskData.map(item => item.systemSectionName);

          var uniqueSystems = systems.filter((value, index, array) => {
            return array.indexOf(value) === index;
          })

          const dataSets = uniqueSystems.map(system => {
            const systemData = uniqueLabels.map(date => {
              const item = this.taskData.map(d => d.startTaskDate === date && d.systemSectionName === system);


              return item.reduce((acc, val) => val ? acc + 1 : acc, 0);
            })

            return {
              label: system,
              data: systemData
            }
          })

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

    this.requestDate = new Date().setDate(this.currentDate.getDate() - 8);

    this.createDataSet();
  }

  loadDataForYear() {
    this.destroyChart();

    const currentYearDate = new Date(this.currentDate.getFullYear(), 1, 1)
    this.requestDate = new Date(currentYearDate).getMilliseconds();

    this.createDataSet();
  }


  ngOnDestroy() {
    this.isChangeTaskDataSubscribtion.unsubscribe();
  }

}
