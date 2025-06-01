import { Component, Input, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { calculateAverageTime } from '../../../utils/avg-time-calculator';
import { DatePipe } from '@angular/common';
import { TaskData } from '../../../tasks/shared/models/task-data.model';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-table-avg-time-system-sections',
  templateUrl: './table-avg-time-system-sections.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class TableAvgTimeSystemSectionsComponent implements OnInit, OnDestroy {

  taskData: TaskData[] = [];
  tableLabelSet: any;
  tableDataSet: any;
  avgTimeToAllSystemSections: string = '';
  isLoading: boolean = false;

  currentDate = new Date();
  defaultRequestDate = new Date().setDate(this.currentDate.getDate() - 8);
  requestDate = this.defaultRequestDate;


  isChangeTaskDataSubscribtion!: Subscription;

  datePipe = inject(DatePipe);

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.createDataSet();
    this.isChangeTaskDataSubscribtion = this.taskService.changeTaskData$.subscribe(result => {
      if (result) {
        this.createDataSet();
      }
    })
  }

  createDataSet() {
    this.isLoading = true;
    this.taskService.getTasks(this.requestDate).subscribe({
      next: result => {
        if (Array.isArray(result)) {

          this.taskData = result;

          const taskDates: string[] = this.taskData.map(data => data.startTaskDate);

          var uniqueLabels = taskDates.filter((value, index, array) => {
            return array.indexOf(value) === index;
          })

          this.tableLabelSet = uniqueLabels;

          const systems = this.taskData.filter(item => taskDates.includes(item.startTaskDate)).map(system => system.systemSectionName);

          var uniqueSystems = systems.filter((value, index, array) => {
            return array.indexOf(value) === index;
          })

          const dataSets = uniqueSystems.map(system => {
            const systemData = this.taskData.filter(d => taskDates.includes(d.startTaskDate) && d.executedTime !== null
              && d.systemSectionName === system).map(x => x.executedTime);

            return {
              label: system,
              data: systemData.length > 0 ? calculateAverageTime(systemData) : '',
              parsing: false
            }
          })

          this.avgTimeToAllSystemSections = calculateAverageTime(dataSets.filter(x => x.data != '').map(item => item.data));
          this.tableDataSet = dataSets;
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
    this.requestDate = new Date().setDate(this.currentDate.getDate() - 8);

    this.createDataSet();
  }

  loadDataForYear() {
    const currentYearDate = new Date(this.currentDate.getFullYear(), 1, 1)
    this.requestDate = new Date(currentYearDate).getMilliseconds();

    this.createDataSet();

  }

  ngOnDestroy() {
    this.isChangeTaskDataSubscribtion.unsubscribe();
  }
}
