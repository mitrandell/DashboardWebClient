import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateTasksComponent } from './modules/tasks/components/create-tasks/create-tasks.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './modules/shared/components/loader/loader.component';
/*import { provideCharts, withDefaultRegisterables } from 'ng2-charts';*/
import { LinechartComponent } from './modules/charts/components/linechart/linechart.component';
import { BarchartSystemSectionsComponent } from './modules/charts/components/barchart-system-sections/barchart-system-sections.component';
import { TableAvgTimeSystemSectionsComponent } from './modules/tables/components/table-avg-time-system-sections/table-avg-time-system-sections.component';
import { BarchartSameTasksComponent } from './modules/charts/components/barchart-same-tasks/barchart-same-tasks.component';
import { TableAvgExecutedTimeSameTasksComponent } from './modules/tables/components/table-avg-executed-time-same-tasks/table-avg-executed-time-same-tasks.component';
import { DatePipe } from '@angular/common';
import { TableTaskListComponent } from './modules/tables/components/table-task-list/table-task-list.component';
import { CreateCriticalTaskComponent } from './modules/tasks/components/create-critical-task/create-critical-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListCriticalTaskComponent } from './modules/tasks/components/list-critical-task/list-critical-task.component';
import { CreateDeveloperTaskComponent } from './modules/tasks/components/create-developer-task/create-developer-task.component';
import { ListDeveloperTaskComponent } from './modules/tasks/components/list-developer-task/list-developer-task.component';
import { EditCriticalTaskComponent } from './modules/tasks/components/edit-critical-task/edit-critical-task.component';
import { EditDeveloperTaskComponent } from './modules/tasks/components/edit-developer-task/edit-developer-task.component';
import { SidebarComponent } from './modules/sidebar/components/sidebar/sidebar.component';
import { ListNotesComponent } from './modules/notes/components/list-notes/list-notes.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard/dashboard.component';
import { ListBussinessDaysComponent } from './modules/bussiness-days/components/list-bussiness-days/list-bussiness-days.component';
import { EditBussinessDayComponent } from './modules/bussiness-days/components/edit-bussiness-day/edit-bussiness-day.component';
import { ErrorModalComponent } from './modules/shared/components/error-modal/error-modal.component';
import { UserLoginComponent } from './modules/authorization/components/user-login/user-login.component';
import { HttpInterceptorService } from './modules/authorization/services/http-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateTasksComponent,
    LoaderComponent,
    LinechartComponent,
    BarchartSystemSectionsComponent,
    TableAvgTimeSystemSectionsComponent,
    BarchartSameTasksComponent,
    TableAvgExecutedTimeSameTasksComponent,
    TableTaskListComponent,
    CreateCriticalTaskComponent,
    ListCriticalTaskComponent,
    CreateDeveloperTaskComponent,
    ListDeveloperTaskComponent,
    EditCriticalTaskComponent,
    EditDeveloperTaskComponent,
    SidebarComponent,
    ListNotesComponent,
    DashboardComponent,
    ListBussinessDaysComponent,
    EditBussinessDayComponent,
    ErrorModalComponent,
    UserLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
