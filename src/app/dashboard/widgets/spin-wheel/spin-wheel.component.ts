import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TicketService} from "../../../services/ticket.service";

import * as moment from 'moment';

@Component({
	selector: 'spin-wheel-widget',
	templateUrl: './spin-wheel-component.html',
	styleUrls: ['./spin-wheel-component.scss'],
})
export class SpinWheelComponent implements OnInit {

	@Input() signalUpdate:any;
	@Output() didUpdateData:EventEmitter<any> = new EventEmitter<any>();

	spinCost = 10;
	spinCount = 5;
	user:any;
	ticketCount = 0;
	winMessage = '';
	centerText = 'Loading...';

	allPrizes = ['5', 'Zero', '10', 'Nada', '100', 'Nothing', '50', '0'];
	winText = '';
	private winProbability = [.13, .13, .2, .13, .05, .13, .1, .13];
	messageTimeout;

	constructor(private service: UserService, private ticketService: TicketService) {}

	ngOnInit() {
		this.service.getCurrentUser().subscribe((user) => {
			this.user = user;
			this.setUp();
		});
	}

	setUp() {
		if( this.user.spinWheel && this.user.spinWheel.length ) {
			console.log(this.user.spinWheel);
			const todaysSpins = this.user.spinWheel.filter(x => moment(x.createdAt).isAfter(moment().startOf('day')) && moment(x.createdAt).isBefore(moment().add(1, 'day').startOf('day')) );
			console.log(todaysSpins);
			this.spinCount = 5 - todaysSpins.length;
		} else {
			this.user.spinWheel = [];
		}
		this.centerText = this.spinCount+' spins left';
		this.ticketService.myTickets(this.user._id).subscribe((data) => {
			this.ticketCount = data[0].count;
			this.getWin();
		});
	}

	getWin() {
		this.winText = this.allPrizes[this._getRandomIndexByProbability(this.winProbability)];
	}

	wheelSpun() {
		let cClass = 'text-danger';
		let message = '';
		let tickets = 0;
		switch (this.winText) {
			case '0':
			case '5':
			case '10':
			case '50':
			case '100':
				if( this.winText !== '0' )
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
			this.user = user;
			this.didUpdateData.emit({'my-tickets-widget': true});
			this.ticketService.save$({amount: tickets, user: this.user._id, refType: 'wheelSpin', reason:'You spun the wheel to test your luck.'}).subscribe((d) => {
				this.setUp();
			});
		});
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














