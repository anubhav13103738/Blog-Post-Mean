import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'Expansion Panel 1', content: 'Expansion Panel 1 content' },
  //   { title: 'Expansion Panel 2', content: 'Expansion Panel 2 content' },
  //   { title: 'Expansion Panel 3', content: 'Expansion Panel 3 content' },
  // ];
  constructor(public postService: PostService, private auth: AuthService) {}
  posts: Post[] = [];
  postSub: Subscription;
  isAuthenticatedSub: Subscription;
  isAuthenticated = false;
  isLoading = false;
  userId: string;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  postPageOptions = [1, 2, 5, 10];
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.auth.getUserId();
    this.postSub = this.postService
      .getPostObservableListener()
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });

    this.isAuthenticated = this.auth.getIsAuth();

    this.isAuthenticatedSub = this.auth
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.auth.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.postService.getPosts(pageData.pageSize, pageData.pageIndex + 1);
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.isAuthenticatedSub.unsubscribe();
  }
}
