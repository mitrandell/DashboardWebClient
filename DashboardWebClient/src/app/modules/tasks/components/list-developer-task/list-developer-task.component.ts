import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { TaskService } from '../../shared/tasks.service';
import { Subscription } from 'rxjs';
import { DeveloperTaskData } from '../../shared/interfaces/developer-task-data.interface';
import { EditDeveloperTaskComponent } from '../edit-developer-task/edit-developer-task.component';
import { HostListener } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';


@Component({
  selector: 'app-list-developer-task',
  templateUrl: './list-developer-task.component.html',
  styleUrl: 'list-developer-task.component.css'
})
export class ListDeveloperTaskComponent {
  taskData: DeveloperTaskData[] = []
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRowIndex: number | null = null;

  @ViewChild('editModal') editModal!: EditDeveloperTaskComponent;

  isLoading = false;

  isChangeCriticalTaskDataSubscribtion!: Subscription;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.createDataSet();
    this.isChangeCriticalTaskDataSubscribtion = this.taskService.changeCriticalTaskData$.subscribe(result => {
      if (result) {
        this.createDataSet();
      }
    })
  }

  createDataSet() {
    this.isLoading = true;
    this.taskService.getDeveloperTasks().subscribe({
      next: result => {
        if (Array.isArray(result)) {
          this.taskData = result;
        }

        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.errorModal.openModal(err);
      }
    })
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.contextMenuVisible = false;
  }

  showContextMenu(event: MouseEvent, index: number) {
    event.preventDefault();

    this.contextMenuPosition = {
      x: event.clientX,
      y: event.clientY
    };

    this.selectedRowIndex = index;
    this.contextMenuVisible = true;
  }

  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  openEditModal() {
    if (this.selectedRowIndex !== null) {
      const task = this.taskData[this.selectedRowIndex];
      this.editModal.openModal(task);
    }

    this.closeContextMenu();
  }

  ngOnDestroy() {
    this.isChangeCriticalTaskDataSubscribtion.unsubscribe();
  }
}
