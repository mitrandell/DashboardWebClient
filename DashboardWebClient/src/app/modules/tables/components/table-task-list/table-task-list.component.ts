import { Component, Input, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { calculateAverageTime } from '../../../utils/avg-time-calculator';
import { TaskData } from '../../../tasks/shared/models/task-data.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-table-task-list',
  templateUrl: './table-task-list.component.html',
  styles: ``
})
export class TableTaskListComponent implements OnInit, OnDestroy {
  taskData: TaskData[] = [];
  tableLabelSet: any;
  tableDataSet: any;
  taskDates: any[] = [];
  avgTimeToAllSystemSections: string = '';
  isLoading: boolean = false;

  currentDate = new Date();
  defaultRequestDate = new Date().setDate(this.currentDate.getDate() - 8);
  requestDate = this.defaultRequestDate;

  isChangeTaskDataSubscribtion!: Subscription;

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
          this.taskDates = this.taskData.map(data => data.startTaskDate);
          const dataSets = this.taskData.filter(d => this.taskDates.includes(d.startTaskDate));
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
