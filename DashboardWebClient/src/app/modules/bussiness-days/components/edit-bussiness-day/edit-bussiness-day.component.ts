import { Component, ViewChild, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditBussinessDay } from '../../shared/interfaces/edit-bussiness-day.interface';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BussinessDay } from '../../shared/interfaces/bussiness-day.interface';
import { TaskService } from '../../../tasks/shared/tasks.service';
import { BussinesDaysService } from '../../shared/bussines-days.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-edit-bussiness-day',
  templateUrl: './edit-bussiness-day.component.html',
  styles: ``
})
export class EditBussinessDayComponent {
  isLoading = false;
  modalService = inject(NgbModal);
  modalTitle: string = '';
  selectedDayType: string = '';

  editData = {
    id: 0,
    typeId: 0
  }

  dayTypes = ["Рабочий", "Выходной"]

  @ViewChild('content') public template!: TemplateRef<any>;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;
  constructor(private bussinessDayService: BussinesDaysService) {}

  openModal(day: BussinessDay) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };

    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.editData.id = day.id,
    this.editData.typeId = day.typeId,
    this.selectedDayType = this.dayTypes[day.typeId - 1];
    this.modalTitle = day.date;

    this.modalService.open(this.template, options);
  }


  edit() {
    this.isLoading = true;
    this.editData.typeId = this.dayTypes.indexOf(this.selectedDayType) + 1;

    this.bussinessDayService.editBussinessDay(this.editData).subscribe({
      next: result => {
        this.bussinessDayService.changeBussinessDayData$.next(true);
        this.modalService.dismissAll();
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.errorModal.openModal(err);
      }
    })
  }
}
