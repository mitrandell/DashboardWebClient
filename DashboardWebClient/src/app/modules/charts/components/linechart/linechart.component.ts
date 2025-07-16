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
  styles: ``
})
export class LinechartComponent extends ChartBase implements OnInit, OnDestroy {

  taskData: TaskData[] = [];
  chartLabelSet: string[] = [];
  chartDataSet: any;
  isLoading = false;
  months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  currentDate = new Date();
  requestDate: string | null = '';

  datePipe = inject(DatePipe);

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
    const config: ChartConfiguration<'line'> =  {
      type: 'line',

      data: {
        labels: this.chartLabelSet,
        datasets: [
          {
            label: "Количество поступивших обращений",
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
            title: {
              display: true,
              text: 'Количество обращений'
            },
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

  createDataSetForYear() {
    this.isLoading = true;
    this.taskService.getTasks(this.requestDate).subscribe({
      next: result => {
        if (Array.isArray(result)) {
          this.taskData = result;

          const labels: string[] = this.taskData.map(data => data.startTaskDate);

          const months = [...new Set(
            this.taskData.map(data => {
              const dateObj = new Date(data.startTaskDate);
              return dateObj.getMonth() + 1;
            })
          )]

          this.chartLabelSet = months.map(month => {
            return this.months[month - 1]
          });

          const dataSet = months.map(month => {
            const item = this.taskData.filter(data => {
              const date = new Date(data.startTaskDate).getMonth() + 1;
              return date === month
            }).length

            return item;
          });

          this.chartDataSet = dataSet;

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

  createDataSetForWeak() {
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

    const getDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7, 0, 0, 0);
    this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss");

    this.createDataSetForWeak();
  }

  loadDataForYear() {
    this.destroyChart();

    const getDate = new Date(this.currentDate.getFullYear(), 0, 1);
    this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss")

    this.createDataSetForYear();
  }

  ngOnDestroy() {
    this.isChangeTaskDataSubscribtion.unsubscribe();
  }
}
