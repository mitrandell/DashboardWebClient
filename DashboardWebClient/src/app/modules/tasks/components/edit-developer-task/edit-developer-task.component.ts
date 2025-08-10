import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { DeveloperTaskData } from '../../shared/interfaces/developer-task-data.interface';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../shared/tasks.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-edit-developer-task',
  templateUrl: './edit-developer-task.component.html',
  styles: ``
})
export class EditDeveloperTaskComponent {

  isLoading = false;

  form: FormGroup;
  modalService = inject(NgbModal);

  itsmStatuses = {
    new: 'Новый',
    inProccess: 'В процессе',
    completed: 'Завершено'
  }

  redmineStatuses = {
    new: 'Новая задача',
    inProccess: 'В работе',
    completed: 'Выполнена'
  }

  actionStatuses = {
    inProccess: 'В процессе',
    completed: 'Завершено'
  }

  @ViewChild('content') public template!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      id: [0],
      taskNumber: [0],
      itsmStatus: [''],
      redmineSatus: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      createAt: [''],
      actionStatus: ['В процессе']
    });
  }

  openModal(task: DeveloperTaskData | null) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };

    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.form.patchValue({
      id: task?.id,
      taskNumber: task?.taskNumber,
      itsmStatus: task?.itsmStatus,
      redmineSatus: task?.redmineSatus,
      description: task?.description,
      startDate: task?.startDate,
      endDate: task?.endDate,
      actionStatus: task?.actionStatus,
      createAt: task?.createAt
    })

    this.modalService.open(this.template, options);
  }


  edit() {
    const MAX_TASK_NUMBER_VALUE = 999999999999
    if (this.form.get('taskNumber')?.value < MAX_TASK_NUMBER_VALUE) {
      this.isLoading = true;
      this.taskService.editDeveloperTask(this.form.value).subscribe({
        next: result => {
          this.taskService.changeDeveloperTaskData$.next(true);
          this.modalService.dismissAll();
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.errorModal.openModal(err);
        }
      })
    }
    else {
      this.errorModal.openModal("Введено слишком больше число. Максимально допустимое значение - 999999999999");
    }
  }
}
