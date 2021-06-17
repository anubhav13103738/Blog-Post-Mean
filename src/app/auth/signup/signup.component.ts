import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.createUser(form.value.email, form.value.password);
    // console.log('signup form submit:', form.value);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
