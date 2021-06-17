import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'post/';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postSubject = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedData) => {
        this.posts = transformedData.posts;
        this.postSubject.next({
          posts: [...this.posts],
          postCount: transformedData.maxPosts,
        });
      });
  }

  getPostObservableListener() {
    return this.postSubject.asObservable();
  }

  // getPost(postId: string) {
  //   return { ...this.posts.find((p) => p.id === postId) };
  // }
  getPost(postId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + postId);
  }

  updatePost(id, title: string, content: string, image: File | string) {
    let postData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe((responseData) => {
      // console.log('responseData:', responseData);
      // const updatedPost = [...this.posts];
      // const oldPostIndex = updatedPost.findIndex((p) => p.id === postData.id);
      // updatedPost[oldPostIndex] = postData;
      // this.posts = updatedPost;
      // this.postSubject.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  addNewPost(title: string, content: string, file: File) {
    // const post: Post = { id: null, title, content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', file, title);

    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((createdPost) => {
        // console.log('message from server:', createdPost.message);
        // const post: Post = {
        //   id: createdPost.post.id,
        //   title: createdPost.post.title,
        //   content: createdPost.post.content,
        //   imagePath: createdPost.post.imagePath,
        // };
        // // post.id = createdPost.postId;
        // this.posts.push(post);
        // this.postSubject.next(this.posts);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
