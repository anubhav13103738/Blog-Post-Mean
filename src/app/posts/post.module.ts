import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [],
})
export class PostModule {}
