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
  requestDate: string | null = '';

  isChangeTaskDataSubscribtion!: Subscription;

  datePipe = inject(DatePipe);

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadDataForWeek();
    this.isChangeTaskDataSubscribtion = this.taskService.changeTaskData$.subscribe(result => {
      if (result) {
        this.loadDataForWeek();
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
    const getDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7, 0, 0, 0);
    this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss");

    this.createDataSet();
  }

  loadDataForYear() {
    const getDate = new Date(this.currentDate.getFullYear(), 0, 1);
    this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss")

    this.createDataSet();
  }

  ngOnDestroy() {
    this.isChangeTaskDataSubscribtion.unsubscribe();
  }
}
