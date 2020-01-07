import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {TicketService} from '../../../services/ticket.service';
import {UserService} from "../../../services/user.service";
import {combineLatest, of} from "rxjs";

@Component({
	selector: 'app-ticket',
	templateUrl: './ticket-opportunity.component.html',
	styleUrls: ['./ticket-opportunity.component.scss'],
	providers: [TicketService],
})
export class TicketOpportunityComponent implements OnInit {


	ticketOpp: any = {};
	loading = false;

	structure: IField[] = [
		{
			name: 'Amount',
			_id: 'amount',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
		},
		{
			name: 'Reference Link',
			_id: 'refLink',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.URL,
		},
		{
			name: 'Required Action',
			_id: 'requiredAction',
			type: FieldTypeEnum.Input,
		},
		{
			name: 'ref',
			_id: 'refType',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'name',
			options: [
				{_id:'facebook', name:'Facebook'},
				{_id:'login', name:'Login'},
				{_id:'twitter', name:'Twitter'},
				{_id:'twitch', name:'Twitch'},
				{_id:'instagram', name:'Instagram'},
			]
		}, {
			name: 'Start Time',
			_id: 'startsAt',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.Date,
			pickerType: 'datetime',
		}, {
			name: 'End Time',
			_id: 'expiresAt',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.Date,
			pickerType: 'datetime',
		},
	];

	constructor(
		private service: TicketService,
		private userService: UserService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const ticketOpp$ = id !== 'new' ? this.service.getOpportunityById$(id) : of(this.ticketOpp);
		combineLatest(ticketOpp$).subscribe((data) => {
			[this.ticketOpp] = data;
			this.pageTitleService.setTitle(this.ticketOpp._id ? 'Edit Ticket Opportunity' : 'New Ticket Opportunity');
			this.loading = false;
		});
	}

	save(ticketOpp) {
		ticketOpp = { ...ticketOpp, _id: this.ticketOpp._id };
		this.service.saveOpportunity$(ticketOpp).subscribe(
			data => {
				this.ticketOpp = data;
				this.pageTitleService.setTitle(this.ticketOpp.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.ticketOpp._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}
}
