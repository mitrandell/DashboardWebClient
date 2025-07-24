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
})
export class TableTaskListComponent implements OnInit, OnDestroy {
  taskData: TaskData[] = [];
  tableLabelSet: any;
  tableDataSet: any;
  taskDates: any[] = [];
  avgTimeToAllSystemSections: string = '';
  isLoading: boolean = false;

  datePipe = inject(DatePipe);

  isChangeTaskDataSubscribtion!: Subscription;

  @Input() requestDate: string | null = '';
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

  ngOnDestroy() {
    this.isChangeTaskDataSubscribtion.unsubscribe();
  }
}
