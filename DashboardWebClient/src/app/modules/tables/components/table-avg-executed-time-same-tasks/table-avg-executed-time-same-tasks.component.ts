import { Component, Input, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { calculateAverageTime } from '../../../utils/avg-time-calculator';
import { DatePipe } from '@angular/common';
import { TaskData } from '../../../tasks/shared/models/task-data.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-table-avg-executed-time-same-tasks',
  templateUrl: './table-avg-executed-time-same-tasks.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class TableAvgExecutedTimeSameTasksComponent implements OnInit, OnDestroy {
  taskData: TaskData[] = [];
  tableLabelSet: any;
  tableDataSet: any;
  taskDates: any[] = [];
  isLoading: boolean = false;
  avgTimeToAllSystemSections: string = '';
  currentDate = new Date();
  requestDate: string | null = '';
  allSectionData = {
    count: 0,
    avgTime: ''
  }

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

          this.taskDates = this.taskData.map(data => data.startTaskDate);

          const taskTitles = this.taskData.filter(x => this.taskDates.includes(x.startTaskDate))
            .map(item => item.title);
          const duplicateTaskTitles = taskTitles.filter((value, index, array) => {
            return array.indexOf(value) !== index && array.lastIndexOf(value) === index;
          })

          const uniqueTaskData = this.taskData.filter(x => duplicateTaskTitles.includes(x.title)
            && this.taskDates.includes(x.startTaskDate));
          const systems = uniqueTaskData.map(item => item.systemSectionName);

          const uniqueSystems = systems.filter((value, index, array) => {
            return array.indexOf(value) === index;
          })

          const dataSets = duplicateTaskTitles.map(title => {
            const item = uniqueTaskData.map(d => d.title === title
              && this.taskDates.includes(d.startTaskDate));

            const avgExecutedTime = uniqueTaskData.filter(d => d.title === title
              && this.taskDates.includes(d.startTaskDate)
              && d.executedTime !== null)
              .map(x => x.executedTime);

            const system = uniqueTaskData.find(d => d.title === title
              && this.taskDates.includes(d.startTaskDate));

            return {
              system: system?.systemSectionName,
              title: title,
              count: item.reduce((acc, val) => val ? acc + 1 : acc, 0),
              avgExecutedTime: avgExecutedTime.length > 0 ? calculateAverageTime(avgExecutedTime) : ''
            }
          })

          this.allSectionData.avgTime = calculateAverageTime(dataSets.map(x => x.avgExecutedTime).filter(time => time !== ''));
          this.allSectionData.count = dataSets.map(x => x.count).reduce((acc, current) => acc + current);
          this.tableDataSet = dataSets;
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
