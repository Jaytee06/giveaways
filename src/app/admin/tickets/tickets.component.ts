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
			{key: 'user.fullname', name: 'User'},
			{key: 'amount', name: 'Amount'},
			{key: 'reason', name: 'Reason'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['user.fullname', 'amount', 'reason', 'createdAt'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});
				console.log(data);
				this.tableData.dataSource.emit(data);
			}
		);

	}

	ticketSelected(ticket) {
		this.router.navigate([ticket._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
