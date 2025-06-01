import { TemplateRef, ViewChild } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../shared/tasks.service';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../shared/services/loader.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-create-developer-task',
  templateUrl: './create-developer-task.component.html',
  styles: ``
})
export class CreateDeveloperTaskComponent {

  isLoading: boolean = false;

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

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      taskNumber: [0, Validators.maxLength(10)],
      itsmStatus: [''],
      redmineSatus: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      actionStatus: ['В процессе']
    });
  }

  create() {
    const MAX_TASK_NUMBER_VALUE = 999999999999;
    if (this.form.get('taskNumber')?.value < MAX_TASK_NUMBER_VALUE) {
      this.isLoading = true;
      if (this.form.valid) {
        this.taskService.addDeveloperTask(this.form.value).subscribe({
          next: result => {
            this.modalService.dismissAll();
            this.taskService.changeCriticalTaskData$.next(true);
            this.isLoading = false;
          },
          error: err => {
            this.errorModal.openModal(err);
            this.isLoading = false;
          }
        })
      }
    }
    else {
      this.errorModal.openModal("Введено слишком больше число. Максимально допустимое значение - 999999999999");
    }
  }

  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };

    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.modalService.open(content, options);
  }

}
