import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import {RaffleService} from "../services/raffle.service";
import { Router} from "@angular/router";

@Component({
	selector: 'my-giveaways',
	templateUrl: './my-raffles-component.html',
	styleUrls: ['./my-raffles-component.scss'],
	providers:[RaffleService]
})
export class MyRafflesComponent implements OnInit {

	raffles:any[] = [];
	user:any = {};
	querySkip = 0;
	queryLimit = 10;

	smallScreen = window.innerWidth < 450;

	constructor(
		private service: RaffleService,
		private userService: UserService,
		private router: Router,
	) {}

	ngOnInit() {

		const user$ = this.userService.getCurrentUser();
		combineLatest(user$).subscribe((data) => {
			[this.user] = data;
			this.getRaffles();
		});
	}

	getMoreTickets() {
		this.querySkip += this.queryLimit;
		this.getRaffles();
	}

	getRaffles() {
		this.service.filters.winner = this.user._id;
		this.service.filters.skip = this.querySkip;
		this.service.filters.limit = this.queryLimit;
		this.service.get$().subscribe((d:any[]) => {
			d = d.map((t) => {
				t.didStart = this.service.formatDate(t.didStart, true);
				return t;
			});
			this.raffles = this.raffles.concat(d);
		});
	}

	raffleClicked(raffle) {
		this.router.navigate(['/', 'raffle', raffle._id]);
	}
}














