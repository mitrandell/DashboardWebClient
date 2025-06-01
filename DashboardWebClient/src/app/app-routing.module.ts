import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTasksComponent } from './modules/tasks/components/create-tasks/create-tasks.component';
import { LinechartComponent } from './modules/charts/components/linechart/linechart.component';
import { ListNotesComponent } from './modules/notes/components/list-notes/list-notes.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard/dashboard.component';
import { ListBussinessDaysComponent } from './modules/bussiness-days/components/list-bussiness-days/list-bussiness-days.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'bussiness-days', component: ListBussinessDaysComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
