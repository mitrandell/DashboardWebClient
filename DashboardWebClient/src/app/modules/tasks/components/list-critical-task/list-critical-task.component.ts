import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TaskService } from '../../shared/tasks.service';
import { Subscription } from 'rxjs';
import { CriticalTaskData } from '../../shared/interfaces/critical-task-data.interface';
import { HostListener } from '@angular/core';
import { EditCriticalTaskComponent } from '../edit-critical-task/edit-critical-task.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-list-critical-task',
  templateUrl: './list-critical-task.component.html',
  styleUrl: './list-critical-task.component.css'
})
export class ListCriticalTaskComponent implements OnInit, OnDestroy{

  taskData: CriticalTaskData[] = []
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRowIndex: number | null = null;
  isLoading = false;

  isChangeCriticalTaskDataSubscribtion!: Subscription;

  @ViewChild('editModal') editModal!: EditCriticalTaskComponent;

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

    this.taskService.getCriticalTasks().subscribe({
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
    const target = event.target as HTMLElement;
    if (target.closest('td[class="target-link"]')) {
      return;
    }

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

