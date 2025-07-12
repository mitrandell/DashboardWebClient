import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { BussinesDaysService } from '../../shared/bussines-days.service';
import { BussinessDay } from '../../shared/interfaces/bussiness-day.interface';
import { Subscription, switchMap } from 'rxjs';
import { HostListener } from '@angular/core';
import { EditBussinessDay } from '../../shared/interfaces/edit-bussiness-day.interface';
import { EditBussinessDayComponent } from '../edit-bussiness-day/edit-bussiness-day.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-list-bussiness-days',
  templateUrl: './list-bussiness-days.component.html',
  styleUrl: './list-bussiness-days.component.css'
})
export class ListBussinessDaysComponent implements OnInit, OnDestroy{

  days: BussinessDay[] = []
  currentMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  years: number[] = [];
  months: string[] = ['январь', 'февраль', 'март', 'апрель', 'май',
    'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  selectedMonth: string = this.months[new Date().getMonth()];

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRowIndex: number | null = null;

  isLoading = false;

  changeBussinessDayDataSubscription!: Subscription;

  @ViewChild('editModal') editModal!: EditBussinessDayComponent;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private bussnessDaysService: BussinesDaysService) { }

  ngOnInit() {
    this.getData();

    this.changeBussinessDayDataSubscription = this.bussnessDaysService.changeBussinessDayData$.subscribe(result => {
      if (result) {
        this.loadData();
      }
    })
  }

  loadData() {
    this.isLoading = true;
    const month = this.months.indexOf(this.selectedMonth) + 1;

    this.bussnessDaysService.getBussinessDays(this.selectedYear, month).subscribe({
      next: result => {
        if (Array.isArray(result)) {
          this.days = result;
        }

        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.errorModal.openModal(err);
      }
    })
  }

  getData() {
    this.isLoading = true;
    this.bussnessDaysService.getBussinessYears().pipe(
      switchMap(result => {
        if (Array.isArray(result)) {
          this.years = result;
          this.selectedYear = result[result.length - 1];
          const month = this.months.indexOf(this.selectedMonth) + 1;
          this.selectedMonth = this.months[this.currentMonth];

          return this.bussnessDaysService.getBussinessDays(this.selectedYear, month);
        }
        else{
          return [];
        }

      })
    ).subscribe({
      next: result => {
        if (Array.isArray(result)) {
          this.days = result;
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
      const day = this.days[this.selectedRowIndex];
      this.editModal.openModal(day);
    }

    this.closeContextMenu();
  }

  ngOnDestroy() {
    this.changeBussinessDayDataSubscription.unsubscribe();
  }
}
