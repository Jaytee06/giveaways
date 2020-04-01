import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {BlogComponent} from "./blog.component";
import {BlogRoutes} from "./blog.routing";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";
import {BlogPostComponent} from "./blog-post/blog-post.component";
import {PostService} from "../services/post.service";
import {CategoryService} from "../services/category.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(BlogRoutes),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule
    ],
    declarations: [
        BlogComponent,
        BlogPostComponent,
    ],
    providers: [
        PostService,
        CategoryService
    ]
})

export class BlogModule {}
