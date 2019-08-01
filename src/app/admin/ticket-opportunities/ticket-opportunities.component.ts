import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../services/ticket.service";

@Component({
  selector: 'app-tickets',
  templateUrl: './ticket-opportunities.component.html',
  styleUrls: ['./ticket-opportunities.component.scss'],
    providers: [TicketService]
})
export class TicketOpportunitiesComponent implements OnInit {

	tableData: any = {};

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
			{key: 'user.fullname', name: 'Created By'},
			{key: 'amount', name: 'Amount'},
			{key: 'requiredAction', name: 'Amount'},
			{key: 'refType', name: 'Type'},
			{key: 'startsAt', name: 'Starts'},
			{key: 'expiresAt', name: 'Expires'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['user.fullname', 'amount', 'requiredAction', 'refType', 'startsAt', 'expiresAt', 'createdAt'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.getOpportunities$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					if( x.startsAt ) x.startsAt = this.service.formatDate(x.createdAt, true);
					if( x.expiresAt ) x.expiresAt = this.service.formatDate(x.createdAt, true);
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});
				this.tableData.dataSource.emit(data);
			}
		);

	}

	ticketOppSelected(ticketOpp) {
		this.router.navigate([ticketOpp._id], {relativeTo:this.activatedRoute});
	}
}
