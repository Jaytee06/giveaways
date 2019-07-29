import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { StatusService } from '../../services/status.service';

@Component({
	selector: 'app-statuses',
	templateUrl: './statuses.component.html',
	styleUrls: ['./statuses.component.scss'],
	providers: [StatusService],
})
export class StatusesComponent implements OnInit {

	constructor(
		private pageTitleService: PageTitleService,
		private service: StatusService,
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
		statusTypes: true,
		active: true,
	};
	filterTimeout;
	query: any = {};
	totalStatuses: number;

	ngOnInit() {

		this.pageTitleService.setTitle('Statuses');

		this.tableSettings.columns = [
			{ key: 'select', name: 'select' },
			{ key: 'name', name: 'Name' },
			{ key: 'type', name: 'Type' },
			{ key: 'sort', name: 'sort' },
			{ key: 'active', name: 'Active' },
			{ key: 'createdAt', name: 'Created' },
			{ key: '_id', name: 'ID' },
		];
		this.tableSettings.displayedColumns = ['select', 'name', 'type', 'sort', 'active', 'createdAt', '_id'];
		this.tableSettings.dataSource = new EventEmitter();

		this.display();
	}

	display() {
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map(x => {
					x.active = x.active ? 'Yes' : 'No';
					return x;
				});
				this.tableSettings.dataSource.emit(data);
			},
		);

		this.service.getCount$().subscribe((data: any[]) => {
			if( data && data.length )
				this.totalStatuses = data[0].count;
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

	statusSelected(status) {
		this.router.navigate([status._id], { relativeTo: this.activatedRoute }).then();
	}
}
