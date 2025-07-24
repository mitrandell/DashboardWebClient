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
  allSectionData = {
    count: 0,
    avgTime: ''
  }
  avgTimeToAllSystemSections: string = '';
  isLoading: boolean = false;

  isChangeTaskDataSubscribtion!: Subscription;

  datePipe = inject(DatePipe);

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
        if (Array.isArray(result) && result.length > 0) {
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

            const countTasks = this.taskData.filter(d => taskDates.includes(d.startTaskDate) && d.systemSectionName === system).length;

            return {
              label: system,
              count: countTasks,
              time: systemData.length > 0 ? calculateAverageTime(systemData) : '',
              parsing: false
            }
          })

          this.allSectionData.avgTime = calculateAverageTime(dataSets.filter(x => x.time != '').map(item => item.time));
          this.allSectionData.count = dataSets.map(x => x.count).reduce((acc, current) => acc + current);
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
