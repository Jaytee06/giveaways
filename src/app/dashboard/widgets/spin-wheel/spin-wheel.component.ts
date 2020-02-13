import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TicketService} from "../../../services/ticket.service";

import * as moment from 'moment';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../../services/games.service";
import {combineLatest} from "rxjs";

@Component({
	selector: 'spin-wheel-widget',
	templateUrl: './spin-wheel-component.html',
	styleUrls: ['./spin-wheel-component.scss'],
	providers:[TicketService, GameService]
})
export class SpinWheelComponent implements OnInit {

	@Input() signalUpdate:any;
	@Output() didUpdateData:EventEmitter<any> = new EventEmitter<any>();

	loading = true;
	spinCost = 10;
	spinCount = 5;
	user:any;
	ticketCount = 0;
	winMessage = '';
	centerText = 'Loading...';

	allPrizes = ['5', 'Zero', '10', 'Nada', '100', '75', '50', '25'];
	winText = '';
	private winProbability = [.065, .315, .1, .315, .025, .065, .05, .065];
	messageTimeout;
	spinning = false;

	cols = 3;
	games:any[] = [];

	windowWidth = window.innerWidth;

	constructor(
		private service: UserService,
		private ticketService: TicketService,
		private gameService: GameService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {

		if( window.innerWidth < 500 ) {
			this.cols = 1;
		} else if( window.innerWidth < 700 ) {
			this.cols = 2;
		}

		const user$ = this.service.getCurrentUser();
		this.gameService.filters.limit = 6;
		const games$ = this.gameService.get$();
		combineLatest([user$, games$]).subscribe((data) => {
			[this.user, this.games] = data;

			if( this.user.isSubscribed )
				this.winProbability = [.13, .13, .2, .13, .05, .13, .1, .13];

			this.setUp();
			this.loading = false;

			// this.service.checkSubscription(this.user._id).subscribe((d) => {
			// 	this.user.isSubscribed = d;
			// 	this.winProbability = [.13, .13, .2, .13, .05, .13, .1, .13];
			// });

		});
	}

	setUp() {
		if( this.user.spinWheel && this.user.spinWheel.length ) {
			const todaysSpins = this.user.spinWheel.filter(x => moment(x.createdAt).isAfter(moment().startOf('day')) && moment(x.createdAt).isBefore(moment().add(1, 'day').startOf('day')) );
			this.spinCount = 5 - todaysSpins.length;
		} else {
			this.user.spinWheel = [];
		}
		this.centerText = this.spinCount+' spins left';
		this.ticketService.myTickets(this.user._id).subscribe((data:any) => {
			this.ticketCount = data.count;
			this.getWin();
			this.spinning = false;
		});
	}

	getWin() {
		this.winText = this.allPrizes[this._getRandomIndexByProbability(this.winProbability)];
	}

	wheelSpun() {
		if( this.spinning ) return;
		this.spinning = true;

		let cClass = 'text-danger';
		let message = '';
		let tickets = 0;
		switch (this.winText) {
			case '5':
			case '10':
			case '25':
			case '50':
			case '75':
			case '100':
				cClass = 'text-success';

				tickets = Number(this.winText);
				message = 'You won '+tickets+' <i class="fa fa-ticket text-success"></i>!';
				break;
			default:
				message = 'You won '+this.winText;
				break;
		}

		this.winMessage = '<p class="'+cClass+'">'+message+'</p>';
		if( this.messageTimeout ) clearTimeout(this.messageTimeout);
		this.messageTimeout = setTimeout(() => {
			this.winMessage = '';
		}, 3000);

		this.getWin();
		tickets = tickets - this.spinCost;
		this.user.spinWheel.push({wonTickets:tickets});
		this.service.updateUser(this.user).subscribe((user) => {
			this.user = {...this.user, ...user};
			this.didUpdateData.emit({'my-tickets-widget': true});
			this.ticketService.save$({amount: tickets, user: this.user._id, refType: 'wheelSpin', reason:'You spun the wheel to test your luck.'}).subscribe((d) => {
				this.setUp();
			});
		});
	}

	goToGame(game) {
		this.router.navigate(['../../games', game._id, this.user.fullname], {relativeTo:this.activatedRoute});
	}

	private _getRandomIndexByProbability(probabilities) {
		let r = Math.random();
		let index = probabilities.length - 1;

		probabilities.some(function (probability, i) {
			if (r < probability) {
				index = i;
				return true;
			}
			r -= probability;
		});
		return index;
	}
}














