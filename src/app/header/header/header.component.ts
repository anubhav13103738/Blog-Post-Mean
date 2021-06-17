import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.auth.getIsAuth();
    this.authStatusSub = this.auth
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogout() {
    this.isAuthenticated = false;
    this.auth.logoutUser();
  }
}
