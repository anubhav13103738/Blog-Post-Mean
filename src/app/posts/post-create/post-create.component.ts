import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import {
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  NG_ASYNC_VALIDATORS,
  FormGroupDirective,
} from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  constructor(
    public postService: PostService,
    private auth: AuthService,
    public route: ActivatedRoute
  ) {}

  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authSub: Subscription;

  ngOnInit() {
    this.authSub = this.auth.getAuthStatusListener().subscribe(() => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.required],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // this.post = this.postService.getPost(this.postId);
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((responseData) => {
          this.isLoading = false;
          this.post = {
            id: responseData._id,
            title: responseData.title,
            content: responseData.content,
            imagePath: responseData.imagePath,
            creator: responseData.creator,
          };
          this.form.setValue({
            title: responseData.title,
            content: responseData.content,
            image: responseData.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImageSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // console.log(file);
    // console.log(this.form);
    this.form.patchValue({
      image: file,
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onPostSave(formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addNewPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
      this.isLoading = false;
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
      this.isLoading = false;
    }
    this.form.reset();
    formDirective.resetForm();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
