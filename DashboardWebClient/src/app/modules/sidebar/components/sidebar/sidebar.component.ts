import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthorizationService } from '../../../authorization/services/authorization.service';
import { Subscription } from 'rxjs';
import { AuthUserData } from '../../../authorization/models/auth-user-data.model';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnDestroy {
  userDataSubscription!: Subscription;
  userData!: AuthUserData;
  @Input() isSidebarCollapsed = true;
  @Output() sidebarToggle = new EventEmitter<void>();
  @Input() isMobilePlatform = false;

  constructor(private authService: AuthorizationService) {
    this.userDataSubscription = authService.userData$.subscribe(data => {
      this.userData = data;
    })
  }

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
