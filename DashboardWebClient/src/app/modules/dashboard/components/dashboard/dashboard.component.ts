import { DatePipe } from '@angular/common';
import { Component, Output, inject, OnInit } from '@angular/core';
import { filterTypesConst } from '../../../utils/filter-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  @Output() activeFilter: string = filterTypesConst.Weak;

  @Output() requestDate!: string | null;

  datePipe = inject(DatePipe);

  ngOnInit() {
    this.requestDate = this.getDate(filterTypesConst.Weak);
  }

  onFilterClick(filter: string) {
    this.activeFilter = filter;
    this.requestDate = this.getDate(filter);
  }

  get isWeakFilterEntered(): boolean {
    return this.activeFilter === filterTypesConst.Weak;
  }

  get isYearFilterEntered(): boolean {
    return this.activeFilter === filterTypesConst.Year;
  }

  get weakFilterType(): string {
    return filterTypesConst.Weak;
  }

  get yearFilterType(): string {
    return filterTypesConst.Year;
  }

  setRequestDate(filter: string) {
    if (filter === filterTypesConst.Weak) {
      const currentDate = new Date();
      const getDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7, 0, 0, 0);
      this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss");
    }
    if (filter === filterTypesConst.Year) {
      const currentDate = new Date();
      const getDate = new Date(currentDate.getFullYear(), 0, 1);
      this.requestDate = this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss");
    }

  }

  private getDate(filter: string) {
    const currentDate = new Date();
    if (filter === filterTypesConst.Weak) {
      const getDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7, 0, 0, 0);
      return this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss");
    }
    if (filter === filterTypesConst.Year) {
      const getDate = new Date(currentDate.getFullYear(), 0, 1);
      return this.datePipe.transform(getDate, "yyyy-MM-dd HH:mm:ss");
    }

    return null;
  }
}


