import { Component, ViewChild, ElementRef, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartBase } from '../../shared/chart-base.class';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TaskData } from '../../../tasks/shared/models/task-data.model';

import { ChartConfiguration, ChartData, BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip } from 'chart.js';
import { calculateAverageTime } from '../../../utils/avg-time-calculator';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { filterTypesConst } from '../../../utils/filter-constants';

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
  isChangeTaskDataSubscribtion!: Subscription;

  @Input() filterType: string = ''
  @Input() requestDate: string | null = '';
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
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            display: false,
            ticks: {
              stepSize: 100,
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
          }
        },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: function (context) {
              return context.dataset.data[context.dataIndex] !== 0;
            },
        
            anchor: 'end',
            align: 'end',
            color: '#000',
            font: {
              weight: 'bold',
              size: 12
            }
          }
        }
      },
    };

    return config;
  }

  createDataSet() {
    this.destroyChart();
    this.isLoading = true;
    this.taskService.getTasks(this.requestDate).subscribe({
      next: result => {
        if (Array.isArray(result)) {
          this.taskData = result;

          this.taskDates = this.taskData.map(data => data.startTaskDate);

          /*taskTitles.filter(k => k === x.title).length > 10*/
          const taskTitles = this.taskData.map(item => item.title);
          const duplicateTaskTitles = this.duplicateTitlesFilter(taskTitles);
          //taskTitles.filter((value, index, array) => {
          //  return array.indexOf(value) !== index && array.lastIndexOf(value) === index && taskTitles.filter(k => k === value).length > 3;
          //})

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

  private duplicateTitlesFilter(taskTitles: string[]) {
    let countTitles = 2;
    if (this.filterType === filterTypesConst.Month) {
      countTitles = 3;
    }
    if (this.filterType === filterTypesConst.Year) {
      countTitles = 10;
    }

    return taskTitles.filter((value, index, array) => {
      return array.indexOf(value) !== index && array.lastIndexOf(value) === index && taskTitles.filter(title => title === value).length >= countTitles;
    })
  }

  ngOnDestroy() {
    this.isChangeTaskDataSubscribtion.unsubscribe();
  }
}
