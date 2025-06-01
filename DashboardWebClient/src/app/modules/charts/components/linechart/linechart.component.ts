import { Component, Input, inject, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Chart }  from 'chart.js/auto';
import { TaskData } from '../../../tasks/shared/models/task-data.model';
import { DatePipe } from '@angular/common';
import { ChartBase } from '../../shared/chart-base.class';
import { ChartConfiguration, ChartData, BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip } from 'chart.js';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip);

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class LinechartComponent extends ChartBase implements OnInit, OnDestroy {

  taskData: TaskData[] = [];
  chartLabelSet: string[] = [];
  chartDataSet: number[] = [];
  isLoading = false;
  
  currentDate = new Date();
  defaultRequestDate = new Date().setDate(this.currentDate.getDate() - 8);
  requestDate = this.defaultRequestDate;

  isChangeTaskDataSubscribtion!: Subscription;

  datePipe = inject(DatePipe);

  @ViewChild('chart', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private taskService: TaskService) {
    super();
  }

  ngOnInit(){
    this.createDataSet();

    this.isChangeTaskDataSubscribtion = this.taskService.changeTaskData$.subscribe(result => {
      if (result) {
        this.createDataSet();
      }
    })
  }

  formationConfig() {
    const config: ChartConfiguration<'line'> =  {
      type: 'line',

      data: {
        labels: this.chartLabelSet,
        datasets: [
          {
            label: "Количество поступивших обращений за день",
            data: this.chartDataSet,
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
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

          let data: number[] = [];
          const counted = new Set();

          for (let i = 0; i < labels.length; i++) {
            if (counted.has(labels[i])) {
              continue;
            }

            let count = 1;

            for (let j = i + 1; j < labels.length; j++) {
              if (labels[i] === labels[j]) {
                count += 1;
              }
            }

            data.push(count);
            counted.add(labels[i]);

          }

          this.chartDataSet = data;

          const config = this.formationConfig();
          this.updateChartData(this.chartCanvas.nativeElement, config);
        }

        this.isLoading = false;
    },
      error: err => {
        this.errorModal.openModal(err);
        this.isLoading = false;
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
