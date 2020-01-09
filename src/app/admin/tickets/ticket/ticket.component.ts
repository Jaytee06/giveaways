import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {TicketService} from '../../../services/ticket.service';
import {UserService} from "../../../services/user.service";
import {combineLatest, of} from "rxjs";

@Component({
	selector: 'app-ticket',
	templateUrl: './ticket.component.html',
	styleUrls: ['./ticket.component.scss'],
	providers: [TicketService],
})
export class TicketComponent implements OnInit {


	ticket: any = {};
	loading = false;
	users = [];
	ticketOpps = [];

	structure: IField[] = [
		{
			name: 'User',
			_id: 'user',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'fullname',
			options: this.users,
			required: true,
		},
		{
			name: 'Amount',
			_id: 'amount',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
		},
		{
			name: 'Reference Type',
			_id: 'refType',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'name',
			options: [
				{_id:'triviaQuiz', name:'Trivia Quiz Results'},
				{_id:'ticketOpp', name:'Ticket Opportunity', dependents:['ref']},
				{_id:'raffle', name:'Raffle'},
				{_id:'signUp', name:'Sign Up'},
				{_id:'loginBonus', name:'Login'},
				{_id:'wheelSpin', name:'Wheel Spin'}
			],
		},
		{
			name: 'Reference',
			_id: 'ref',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'name',
			options: [],
			originallyHidden: true,
		},
		{
			name: 'Reason',
			_id: 'reason',
			type: FieldTypeEnum.Input,
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
		const ticket$ = id !== 'new' ? this.service.getById$(id) : of(this.ticket);
		const users$ = this.userService.getUsers();
		const ticketOpps$ = this.service.getOpportunities$();
		combineLatest(ticket$, users$, ticketOpps$).subscribe((data) => {
			[this.ticket, this.users, this.ticketOpps] = data;
			this.pageTitleService.setTitle(this.ticket._id ? 'Edit Ticket' : 'New Ticket');
			this.structure.find(i => i.name === 'User').options = this.users;
			this.structure.find(i => i._id === 'ref').options = this.ticketOpps.map((x) => {
				x.name = x.refType+' '+x.requiredAction;
				return x;
			});
			this.loading = false;
		});
	}

	save(ticket) {
		ticket = { ...ticket, _id: this.ticket._id };
		this.service.save$(ticket).subscribe(
			data => {
				this.ticket = data;
				this.pageTitleService.setTitle(this.ticket.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.ticket._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}
}
