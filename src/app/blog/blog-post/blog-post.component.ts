import {Component, OnInit} from '@angular/core';
import {combineLatest, of} from "rxjs";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PostService} from "../../services/post.service";

@Component({
	selector: 'blog-post',
	templateUrl: './blog-post-component.html',
	styleUrls: ['./blog-post-component.scss'],
})
export class BlogPostComponent implements OnInit {

	post:any = {};
	user:any = null;
	postComments = [];
	querySkip = 0;
	queryLimit = 10;
	newComment = {
		text:''
	};

	constructor(
		private service: PostService,
		private userService: UserService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {}

	ngOnInit() {

		const { activatedRoute: { snapshot: { params: { title } } } } = this;
		const post$ = title !== 'new' ? this.service.getByTitle$(title) : of(this.post);

		// const user$ = this.userService.getCurrentUser();
		// combineLatest(game$, user$).subscribe((data) => {
		// 	[this.game, this.user] = data;
		combineLatest(post$).subscribe((data) => {
			[this.post] = data;
			this.getComments();
		});

		const token = localStorage.getItem('token');
		if( token ) {
			const user$ = this.userService.getCurrentUser();
			combineLatest(user$).subscribe((data) => {
				[this.user] = data;
			});
		}
	}

	getMoreComments() {
		this.querySkip += this.queryLimit;
		this.getComments();
	}

	getComments() {
		console.log(this.post);
		this.service.filters.skip = this.querySkip;
		this.service.filters.limit = this.queryLimit;
		this.service.getComments(this.post._id).subscribe((d:any[]) => {
			this.postComments = this.postComments.concat(d);
			console.log(this.postComments);
		});
	}

	addComment() {
		this.service.addComment(this.post._id, this.newComment).subscribe((data) => {
			this.postComments.splice(0, 0, data);
			this.clearComment();
		});
	}

	clearComment() {
		this.newComment.text = '';
	}

	goToCategory(category) {
		console.log('going');
		this.router.navigate(['/', 'blog', 'list', category.name.toLowerCase().replace(/ /g, '-')], {relativeTo:this.activatedRoute});
	}
}














