import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RaffleService} from "../../../services/raffle.service";

import * as moment from "moment-timezone";

@Component({
	selector: 'raffles-widget',
	templateUrl: './raffles-component.html',
	styleUrls: ['./raffles-component.scss'],
	providers:[RaffleService]
})
export class RafflesComponent implements OnInit {

	raffles = [];
	raffle: any; // last raffle
	raffleCountDown = '00 d 00 h 00 m 00 s';

	windowWidth = window.innerWidth;

	constructor(private service: RaffleService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {

	}

	ngOnInit() {
		this.service.currentRaffles().subscribe((data:any[]) => {
			this.raffle = data[data.length-1];

			if( this.windowWidth < 1000 ) {
				let i = this.raffle.giveAwayImage.lastIndexOf('.');
				this.raffle.giveAwayImage = this.raffle.giveAwayImage.substr(0, i) + '_short' + this.raffle.giveAwayImage.substr(i);
			}

			this.updateTimes(data);
		});
	}

	raffleClicked(raffle) {
		this.router.navigate(['../../raffle', raffle._id], {relativeTo:this.activatedRoute});
	}

	updateTimes(raffles) {
		this.raffles = raffles.map((q) => {
			let showTime = q.start;
			q.status = "Starting";
			if( q.didStart ) {
				q.status = "In Progress";
				showTime = q.didStart;
				if( q.didEnd ) {
					q.status = "Ended";
					showTime = q.didEnd;
				}
			}
			q.displayTime = this.service.formatDate(showTime, false, true);
			return q;
		});

		if( this.raffle.status === 'Starting' ) {
			this.runCountDown();
		} else {
			setTimeout(() => {
				this.updateTimes(this.raffles);
			}, 60000);
		}
	}

	runCountDown() {
		if( this.raffle )
			this.raffleCountDown = moment(moment.utc(this.raffle.start).diff(moment.utc())).utc().subtract(1, 'day').format('D:HH:mm:ss');

		setTimeout(() =>{
			this.runCountDown();
		}, 1000);
	}
}














