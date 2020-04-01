import { Routes } from '@angular/router';

import {BlogComponent} from "./blog.component";
import {BlogPostComponent} from "./blog-post/blog-post.component";

export const BlogRoutes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full',
}, {
  path: '',
  children: [
      {
          path: 'list',
          component: BlogComponent
      },{
          path: 'list/:category',
          component: BlogComponent
      },{
          path: ':title',
          component: BlogPostComponent
      },
  ]
}];
