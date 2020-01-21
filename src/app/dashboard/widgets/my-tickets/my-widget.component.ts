import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TicketService} from "../../../services/ticket.service";

@Component({
	selector: 'my-tickets-widget',
	templateUrl: './my-tickets-component.html',
	styleUrls: ['./my-tickets-component.scss'],
})
export class MyWidgetComponent implements OnInit, OnChanges {

	@Input() signalUpdate:any;
	@Output() didUpdateData:EventEmitter<any> = new EventEmitter<any>();
	user;
	ticketCount = 0;

	constructor(private service: TicketService, private userService: UserService) {

	}

	ngOnInit() {
		this.userService.getCurrentUser().subscribe((user) => {
			this.user = user;
			this.setUp();
		});
	}

	setUp() {
		this.service.myTickets(this.user._id).subscribe((data:any) => {
			this.ticketCount = data.count;
		});
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if( changes.signalUpdate && changes.signalUpdate.currentValue && changes.signalUpdate.currentValue['my-tickets-widget'] === true ) {
			this.setUp();
		}
	}
}














