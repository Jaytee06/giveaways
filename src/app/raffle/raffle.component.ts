import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RaffleService} from "../services/raffle.service";
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import {RaffleTicketsDialogComponent} from "./dialog/raffle-tickets-dialog/raffle-tickets-dialog.component";
import {MatDialog} from "@angular/material";
import {TicketService} from "../services/ticket.service";
import {AngularFirestore} from "@angular/fire/firestore";
import * as moment from "moment";
import {PageTitleService} from "../core/page-title/page-title.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
	selector: 'raffle',
	templateUrl: './raffle-component.html',
	styleUrls: ['./raffle-component.scss'],
})
export class RaffleComponent implements OnInit {

	raffle:any = {};
	user:any = {};
	raffleEntry;
	maxTickets = 0;

	states = [];
	firstRowHeight = window.innerWidth * .35;

	claiming=false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;

	constructor(
		private service: RaffleService,
		private userService: UserService,
		private ticketService: TicketService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private dialog: MatDialog,
		private fs: AngularFirestore,
		private _formBuilder: FormBuilder
	) {}

	ngOnInit() {

		this.pageTitleService.setTitle('');
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const raffle$ = this.service.getById$(id);
		const user$ = this.userService.getCurrentUser();
		combineLatest(raffle$, user$).subscribe((data) => {
			[this.raffle, this.user] = data;
			this.raffle.start = this.service.formatDate(this.raffle.start, true);

			this.service.filters.user = this.user._id;
			this.service.getRaffleEntries$(this.raffle._id).subscribe((d:any[]) => {
				if( d && d.length )
					this.raffleEntry = d[0];
				else
					this.raffleEntry = {user: this.user._id, raffle: this.raffle._id, tickets:0};

				delete this.service.filters.user;
				this.getCounts();
			});

			this.ticketService.myTickets(this.user._id).subscribe((d:any[]) => {
				if( d && d.length )
					this.maxTickets = d[0].count;
			});

			this.fs.collection('raffles').doc(this.raffle._id).valueChanges().subscribe((d:any) => {
				if( d ) {
					if (!this.raffle.didEnd && d.didEnd) {
						this.service.getById$(this.raffle._id).subscribe((r) => {
							this.raffle = r;
							this.updateTimes();
						});
					} else {
						this.raffle = {...this.raffle, ...d};
						this.updateTimes();
					}
				}
			});

			this.firstFormGroup = this._formBuilder.group({
				chosenDeliveryMethod: ['', Validators.required]
			});
			this.secondFormGroup = this._formBuilder.group({
				email: ['', [Validators.required, Validators.email]],
				address: ['', Validators.required],
				address2: [''],
				city: ['', Validators.required],
				state: ['', Validators.required],
				zip: ['', Validators.required],
			});

			if( !this.user.address ) this.user.address = {shipping:{}};
		});

		this.states = this.service.getStates();
	}

	changeTickets() {
		const dialogRef = this.dialog.open(RaffleTicketsDialogComponent, {data:{raffleEntry:this.raffleEntry, maxTickets:this.maxTickets}});
		dialogRef.afterClosed().subscribe((result) => {
			if( result !== false ) {
				this.service.saveRaffleEntry$(this.raffleEntry).subscribe((d) => {
					this.raffleEntry = d;
					this.getCounts();
				});
			}
		});
	}

	getCounts() {
		this.raffle.enteredTickets = 0;
		this.user.winPercent = 0;

		this.service.filters.raffle = this.raffle._id;
		this.service.getRaffleCounts().subscribe((d:any[]) => {
			if( d && d.length ) {
				this.raffle.enteredTickets = d[0].ticketCounts;
				this.user.winPercent = Math.round((this.raffleEntry.tickets/this.raffle.enteredTickets)*100);
			}
		});
	}

	updateTimes() {
		this.raffle.status = "Starting";
		if( this.raffle.didStart ) {
			this.raffle.status = "In Progress";
			this.raffle.displayTime = this.service.formatDate(this.raffle.didStart, false, true);
			if( this.raffle.didEnd ) {
				this.raffle.status = "Ended";
				this.raffle.displayTime = this.service.formatDate(this.raffle.didEnd, false, true);
			}
		} else if( moment().isAfter(this.raffle.start) ) {
			this.raffle.status = "Waiting";
		} else {
			this.raffle.displayTime = this.service.formatDate(this.raffle.start, false, true);
		}
	}

	claimPrize() {
		this.raffle.ffStatus = "5d3df5b6b71bc344fda79c16"; //claimed
		this.service.save$(this.raffle).subscribe(() => {});
		this.userService.updateUser(this.user).subscribe(() => {});
	}
}














