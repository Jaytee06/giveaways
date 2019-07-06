import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {ActivatedRoute, Router} from "@angular/router";
import {RaffleService} from "../services/raffle.service";
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";

@Component({
	selector: 'raffle',
	templateUrl: './raffle-component.html',
	styleUrls: ['./raffle-component.scss'],
})
export class RaffleComponent implements OnInit {

	raffle:any = {};
	user:any = {};

	constructor(
		private service: RaffleService,
		private userService: UserService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {

		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const raffle$ = id !== 'new' ? this.service.getById$(id) : of(this.raffle);
		const user$ = this.userService.getCurrentUser();
		combineLatest(raffle$, user$).subscribe((data) => {
			[this.raffle, this.user] = data;
			this.raffle.start = this.service.formatDate(this.raffle.start, true);
		});
	}

	changeTickets() {

	}
}














