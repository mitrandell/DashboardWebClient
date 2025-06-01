import { Component, inject, ViewChild } from '@angular/core';
import { TaskService } from '../../shared/tasks.service'
import { LoaderService } from '../../../shared/services/loader.service';
import { TaskData } from '../../shared/models/task-data.model';
import { BehaviorSubject } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';


@Component({
  selector: 'app-create-tasks',
  templateUrl: './create-tasks.component.html',
  styles: ``
})
export class CreateTasksComponent {
  file?: File;
  data: TaskData[] = [];
  isLoading = false;
  requestDate = new Date().setDate(new Date().getDate() - 7);

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private tasksService: TaskService) { }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  saveData() {
    if (this.file !== undefined) {
      this.isLoading = true;

      let data = new FormData();
      data.append('file', this.file);

      this.tasksService.addTaskData(data).subscribe({
        next: result => {
          this.tasksService.changeTaskData$.next(true);
          this.isLoading = false;
        },
        error: err => {
          this.errorModal.openModal(err);
          this.isLoading = false;
        }
      })
    }
  }
}
