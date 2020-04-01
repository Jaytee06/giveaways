import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { PostService } from '../../services/post.service';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss'],
	providers: [PostService],
})
export class PostsComponent implements OnInit {

	constructor(
		private pageTitleService: PageTitleService,
		private service: PostService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	resetSkip$: EventEmitter<any> = new EventEmitter(true);
	tableSettings: any = {
		pageSize: 50,
		ajaxPagination: true,
	};
	filterData: any = {
		availableFilters: {
			main: [],
		},
		active: true,
	};
	filterTimeout;
	query: any = {};
	totalPosts: number;

	ngOnInit() {

		this.pageTitleService.setTitle('Posts');

		this.tableSettings.columns = [
			{ key: 'select', name: 'select' },
			{ key: 'title', name: 'Title' },
			{ key: 'authorName', name: 'Author' },
			{ key: 'categories', name: 'Categories' },
			{ key: 'updatedAt', name: 'Updated' },
			{ key: 'createdAt', name: 'Created' },
			{ key: '_id', name: 'ID' },
		];
		this.tableSettings.displayedColumns = ['select', 'title', 'authorName', 'categories', 'updatedAt', 'createdAt', '_id'];
		this.tableSettings.dataSource = new EventEmitter();

		this.display();
	}

	display() {
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map(x => {
					if( x.author ) x.authorName = x.author.fullname;
					if( x.categories && x.categories.length )
						x.categories = x.categories.map((y) => y.name);
					return x;
				});
				this.tableSettings.dataSource.emit(data);
			},
		);

		this.service.getCount$().subscribe((data: any[]) => {
			if( data && data.length )
				this.totalPosts = data[0].count;
		});
	}


	// filterChanged(filters?) {
	// 	if (filters && filters.resetSkip) {
	// 		this.query.skip = 0;
	// 		delete filters.resetSkip;
	// 		this.resetSkip$.emit(true);
	// 	}
	//
	// 	if (!filters.limit) {
	// 		filters.limit = this.tableSettings.pageSize;
	// 	}
	//
	// 	this.query = {
	// 		...this.query,
	// 		...filters,
	// 	};
	// 	this.query = _.pickBy(this.query, (i) => i !== 'null' && i !== null);
	// 	this.applyFilters();
	// }
	//
	// applyFilters() {
	// 	this.service.filters = this.query;
	//
	// 	clearTimeout(this.filterTimeout);
	// 	// this could be triggered many times at once. throttle
	// 	this.filterTimeout = setTimeout(() => {
	// 		this.display();
	// 	}, 250);
	// }

	postSelected(post) {
		this.router.navigate([post._id], { relativeTo: this.activatedRoute }).then();
	}
}
