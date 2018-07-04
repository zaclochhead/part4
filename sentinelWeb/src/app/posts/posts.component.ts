import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  // instantiate posts to an empty array
  posts: any = [];
  value: any; 
  constructor(private postsService: PostsService) { }

  ngOnInit() {
    // Retrieve posts from the API
    this.postsService.getAllPosts().subscribe(posts => {
      console.log(posts);      
      this.posts = posts;
    });
/*     this.postsService.updateElectricity().subscribe(posts => {
      this.value = posts;
    }); */
  }
}