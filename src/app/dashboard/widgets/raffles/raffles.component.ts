import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RaffleService} from "../../../services/raffle.service";

@Component({
	selector: 'raffles-widget',
	templateUrl: './raffles-component.html',
	styleUrls: ['./raffles-component.scss'],
	providers:[RaffleService]
})
export class RafflesComponent implements OnInit {

	raffles = [];
	raffle: any; // last raffle

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

			console.log(this.raffle.giveAwayImage);
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
		setTimeout(() => {
			this.updateTimes(this.raffles);
		}, 60000);
	}
}














