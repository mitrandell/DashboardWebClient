import { Component, Input, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { calculateAverageTime } from '../../../utils/avg-time-calculator';
import { TaskData } from '../../../tasks/shared/models/task-data.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { DatePipe } from '@angular/common';

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
  requestDate: string | null = '';

  datePipe = inject(DatePipe);

  isChangeTaskDataSubscribtion!: Subscription;

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
