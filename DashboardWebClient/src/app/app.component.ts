import { Component, inject, OnInit } from '@angular/core';
import { LoaderService } from './modules/shared/services/loader.service';
import { TaskService } from './modules/tasks/shared/tasks.service';
import { TaskData } from './modules/tasks/shared/models/task-data.model'
import { Subscribable, Subscriber, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from './modules/authorization/services/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isSidebarCollapsed = true;

  constructor(private authService: AuthorizationService) {
    if (localStorage.getItem('token')) {
      this.authService.setUserDetails();
    }
  }

}
