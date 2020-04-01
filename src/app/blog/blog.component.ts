import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import {PageTitleService} from "../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PostService} from "../services/post.service";
import {CategoryService} from "../services/category.service";

@Component({
	selector: 'blog',
	templateUrl: './blog-component.html',
	styleUrls: ['./blog-component.scss'],
})
export class BlogComponent implements OnInit {

	posts:any[] = [];
	categories:any = [];
	user:any = {};
	filters:any = {};
	querySkip = 0;
	queryLimit = 10;

	windowWidth = window.innerWidth;
	imageMaxWidth = '350px';

	isLoading = true;

	constructor(
		private service: PostService,
		private userService: UserService,
		private categoryService: CategoryService,
		private pageService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {
		this.pageService.setTitle("Blog");

		const categories$ = this.categoryService.get$();
		if( this.userService.checkToken() ) {
			const user$ = this.userService.getCurrentUser();
			combineLatest(user$, categories$).subscribe((data) => {
				[this.user, this.categories] = data;
				this.setUp();
			});
		} else {
			combineLatest(categories$).subscribe((data) => {
				[this.categories] = data;
				this.setUp();
			});
		}

		if( window.innerWidth < 500 ) {
			this.imageMaxWidth = '150px';
		} else if( window.innerWidth < 700 ) {
			this.imageMaxWidth = '200px';
		} else if( window.innerWidth < 1100 ) {
			this.imageMaxWidth = '275px';
		}
	}

	setUp() {
		const { activatedRoute: { snapshot: { params: { category } } } } = this;

		if( category ) {
			if( !this.filters.categories ) this.filters.categories = [];
			const cat = this.categories.find(x => x.name.toLowerCase().replace(/ /g, '-') === category);
			if( cat ) {
				if( this.filters.categories.indexOf(cat._id) == -1 )
					this.filters.categories.push(cat._id);
			}
		}

		this.getPosts();
	}

	getMorePosts() {
		this.querySkip += this.queryLimit;
		this.getPosts();
	}

	getPosts() {
		this.isLoading = true;

		this.service.filters.skip = this.querySkip;
		this.service.filters.limit = this.queryLimit;
		this.service.filters = {...this.service.filters, ...this.filters};
		this.service.getBlogPosts$().subscribe((d:any[]) => {
			this.posts = this.posts.concat(d);
			this.isLoading = false;
		});
	}

	goToPost(post) {
		this.router.navigate(['../', post.title.toLowerCase().replace(/ /g, '-')], {relativeTo:this.activatedRoute});
	}

	catSelected(catId) {
		return this.filters.categories && this.filters.categories.indexOf(catId) > -1;
	}

	toggleCat(catId) {
		if (!this.filters.categories) this.filters.categories = [];
		const i = this.filters.categories.indexOf(catId);
		if (i == -1) {
			this.filters.categories.push(catId);
		} else {
			this.filters.categories.splice(i, 1);
			if (!this.filters.categories.length)
				this.router.navigate(['/', 'blog', 'list'], {relativeTo: this.activatedRoute});
		}
		this.posts = [];
		this.getPosts();
	}
}














