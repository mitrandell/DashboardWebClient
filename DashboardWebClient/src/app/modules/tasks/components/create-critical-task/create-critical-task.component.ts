import { TemplateRef } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../shared/tasks.service';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../shared/services/loader.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ViewChild } from '@angular/core';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-create-critical-task',
  templateUrl: './create-critical-task.component.html',
  styles: ``
})
export class CreateCriticalTaskComponent {

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

  defaultForm = {
    taskNumber: [0],
    itsmStatus: [''],
    redmineSatus: [''],
    description: [''],
    startDate: [''],
    endDate: [''],
    urlToRedmineTask: [''],
    actionStatus: ['В процессе']
  }

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group(this.defaultForm);
  }


  create() {
    const MAX_TASK_NUMBER_VALUE = 999999999999;
    if (this.form.get('taskNumber')?.value < MAX_TASK_NUMBER_VALUE) {
      this.isLoading = true;
      this.taskService.addCriticalTask(this.form.value).subscribe({
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
    else {
      this.errorModal.openModal("Введено слишком больше число. Максимально допустимое значение - 999999999999");
    }
  }

  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };

    this.form = this.fb.group(this.defaultForm);
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.modalService.open(content, options);
  }
}

