import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RaffleService} from "../../../services/raffle.service";

@Component({
	selector: 'raffles-widget',
	templateUrl: './raffles-component.html',
	styleUrls: ['./raffles-component.scss'],
})
export class RafflesComponent implements OnInit {

	raffles = [];

	constructor(private service: RaffleService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {

	}

	ngOnInit() {
		this.service.currentRaffles().subscribe((data) => {
			this.updateTimes(data);
		});
	}

	raffleClicked(raffle) {
		this.router.navigate(['../../raffle', raffle._id], {relativeTo:this.activatedRoute});
	}

	updateTimes(raffles) {
		this.raffles = raffles.map((q) => {
			q.status = "Starting";
			if( q.didStart ) {
				q.status = "In Progress";
				if( q.didEnd ) q.status = "Ended";
			}
			q.displayTime = this.service.formatDate(q.start, false, true); return q;
		});
		setTimeout(() => {
			this.updateTimes(this.raffles);
		}, 60000);
	}
}














