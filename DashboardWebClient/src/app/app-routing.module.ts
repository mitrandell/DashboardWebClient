import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTasksComponent } from './modules/tasks/components/create-tasks/create-tasks.component';
import { LinechartComponent } from './modules/charts/components/linechart/linechart.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard/dashboard.component';
import { ListBussinessDaysComponent } from './modules/bussiness-days/components/list-bussiness-days/list-bussiness-days.component';
import { UserLoginComponent } from './modules/authorization/components/user-login/user-login.component';
import { AuthorizationUserGuard } from './modules/authorization/guards/authorization-user-guard.guard';
import { NotesBoardComponent } from './modules/notes/components/notes-board/notes-board.component';
import { ScriptsBoardComponent } from './modules/scripts/components/scripts-board/scripts-board.component';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent, pathMatch: 'full' },
  { path: '', component: DashboardComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'bussiness-days', component: ListBussinessDaysComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'note-board', component: NotesBoardComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'scripts-board', component: ScriptsBoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
