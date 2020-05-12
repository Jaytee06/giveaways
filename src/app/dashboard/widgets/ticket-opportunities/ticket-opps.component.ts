import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TicketService} from "../../../services/ticket.service";

import * as moment from 'moment';
import {combineLatest} from "rxjs";
import {TriviaService} from "../../../services/trivia.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'ticket-opps-widget',
	templateUrl: './ticket-opps-component.html',
	styleUrls: ['./ticket-opps-component.scss'],
	providers:[TicketService, TriviaService]
})
export class TicketOppsComponent implements OnInit {

	@Input() signalUpdate:any;
	@Output() didUpdateData:EventEmitter<any> = new EventEmitter<any>();

	windowWidth = window.innerWidth;

	ticketOpps = [];
	stickyTicketOpps = [];
	user: any;
	quizzes = [];
	cols = 4;

	constructor(
		private service: UserService,
		private ticketService: TicketService,
		private triviaService: TriviaService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {

		if( window.innerWidth < 500 ) {
			this.cols = 1;
		} else if( window.innerWidth < 700 ) {
			this.cols = 2;
		} else if( window.innerWidth < 1000 ) {
			this.cols = 3;
		}

		// clear below settings
		delete this.ticketService.filters.user;
		delete this.ticketService.filters.ticketOpps;

		this.ticketService.filters.liveDuringTime = moment().format();
		const ticketOpps$ = this.ticketService.getOpportunities$();
		const user$ = this.service.getCurrentUser();
		const quizzes$ = this.triviaService.currentTrivia();

		combineLatest(ticketOpps$, user$, quizzes$).subscribe((data) => {
			let ticketOpps, trivia;
			[ticketOpps, this.user, trivia] = data;

			this.updateTimes(trivia);

			// clear above filters
			delete this.ticketService.filters.liveDuringTime;

			this.ticketService.filters.user = this.user._id;
			this.ticketService.filters.ticketOpps = this.ticketOpps.map(x => x._id);
			const redeemed$ = this.ticketService.get$();
			const subscribed$ = this.service.checkSubscription(this.user._id);

			combineLatest(redeemed$, subscribed$).subscribe((d) => {
				let redeemedTicketOpps;
				[redeemedTicketOpps, this.user.isSubscribed] = d;

				redeemedTicketOpps.forEach((rOpp) => {
					let op = ticketOpps.find(x => x._id === rOpp.ref);
					if( op ) {
						if( !op.howOften || op.howOften === 'once' ) {
							op.redeemed = true;
						} else {
							if( moment(rOpp.createdAt).isAfter(moment().subtract(1, op.howOften)) ) {
								op.redeemed = true;
							}
						}
					}
				});

				this.ticketOpps = ticketOpps;
				// this.ticketOpps = ticketOpps.filter(x => !x.sticky);
				// this.stickyTicketOpps = ticketOpps.filter(x => x.sticky).sort((a, b) => a.amount - b.amount);
			});

		});
	}

	quizClicked(quiz) {
		this.router.navigate(['../../trivia-quiz', quiz._id], {relativeTo:this.activatedRoute});
	}

	updateTimes(quizzes) {
		this.quizzes = quizzes.map((q) => {
			q.status = "Starting";
			if( q.didStart ) {
				q.status = "In Progress";
				if( q.didEnd ) q.status = "Ended";
			}
			q.displayTime = this.service.formatDate(q.start, false, false,true); return q;
		});
		setTimeout(() => {
			this.updateTimes(this.quizzes);
		}, 60000);
	}

	opSelected(op) {
		if( op.refLink )
			window.open(op.refLink, "_blank");
	}
}














