import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authSub: Subscription;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.authSub = this.auth.getAuthStatusListener().subscribe((authStatus) => {
      if (authStatus) {
        this.isLoading = false;
      }
    });
  }

  onLogin(form: NgForm) {
    this.auth.loginUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {}
}
