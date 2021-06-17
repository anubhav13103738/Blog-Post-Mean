import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthRoutingModule,
  ],
  exports: [],
})
export class Authmodule {}
