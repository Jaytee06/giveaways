import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../services/ticket.service";
import * as _ from 'lodash';
import {TimezonesService} from "../../services/timezones.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
    providers: [TicketService]
})
export class TicketsComponent implements OnInit {

	resetSkip$: EventEmitter<any> = new EventEmitter(true);
	tableData: any = {
		pageSize:100,
		ajaxPagination: true,
	};
	filterTimeout;
	query: any = {};
	totalTickets: number;
	ticketSummations: any = {
		loading:true,
		total: { name: 'Active Tickets', majorStat: 0, customClass: 'btn-success' },
		subSummations: [],
		rowHeight:'105px',
	};
	filterData: any = {
		availableFilters: {
			main: ['users'],
		},
		more: {
			sortBy: {
				options: ['createdAt'],
			},
		},
		'users': { title: 'User', name: 'user' },
		dateRange: {
			startDate: TimezonesService.getRelativeDateRange('allTime')[0],
			endDate: TimezonesService.getRelativeDateRange('allTime')[1],
		},
	};

	constructor(
		private pageTitleService: PageTitleService,
		private service: TicketService,
		private userService: UserService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Tickets");

		this.tableData.columns = [
			{key: 'user.fullname', name: 'User'},
			{key: 'amount', name: 'Amount'},
			{key: 'reason', name: 'Reason'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['user.fullname', 'amount', 'reason', 'createdAt'];

		this.tableData.dataSource = new EventEmitter();

		this.filterData['users'].items$ = this.userService.getUsers();

		this.filterChanged();

	}

	filterChanged(filters: any = {}) {
		if (filters && filters.resetSkip) {
			this.query.skip = 0;
			delete filters.resetSkip;
			this.resetSkip$.emit(true);
		}

		if (!filters.limit) {
			filters.limit = this.tableData.pageSize;
		}

		this.query = {
			...this.query,
			...filters,
		};
		this.query = _.pickBy(this.query, (i) => i !== 'null' && i !== null);
		this.applyFilters();
	}

	applyFilters() {
		this.service.filters = this.query;

		clearTimeout(this.filterTimeout);
		// this could be triggered many times at once. throttle
		this.filterTimeout = setTimeout(() => {
			this.display();
		}, 250);
	}

	display() {
		console.log(this.service.filters);
		this.tableData.isLoading = true;
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});
				this.tableData.dataSource.emit(data);
			}
		);

		this.service.getCount().subscribe((data: number) => {
			this.totalTickets = data;
		});

		this.updateSummations();
	}

	updateSummations() {
		this.ticketSummations.loading = true;
		this.ticketSummations.total.majorStat = 0;

		this.service.filters.getSpent = true;
		this.service.getCounts$().subscribe((data:any) => {

			this.ticketSummations.total.majorStat = data.reduce((c, t) => {
				return c += t.count;
			}, 0);

			this.service.filters.getSpent = false;
			this.service.getCounts$().subscribe((data1:any) => {
				const count = data1.reduce((c, t) => {
					return c += t.count;
				}, 0);
				this.ticketSummations.subSummations = [{name: 'Earned Tickets', majorStat:count}];
				this.ticketSummations.loading = false;
			});
		});

	}

	ticketSelected(ticket) {
		this.router.navigate([ticket._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
