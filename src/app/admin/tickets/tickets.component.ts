import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../services/ticket.service";

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

	constructor(
		private pageTitleService: PageTitleService,
		private service: TicketService,
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
	}

	ticketSelected(ticket) {
		this.router.navigate([ticket._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
