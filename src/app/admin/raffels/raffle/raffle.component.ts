import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {UserService} from "../../../services/user.service";
import {combineLatest, of} from "rxjs";

import {AngularFirestore} from "@angular/fire/firestore";
import {RaffleService} from "../../../services/raffle.service";

@Component({
	selector: 'app-raffle',
	templateUrl: './raffle.component.html',
	styleUrls: ['./raffle.component.scss'],
	providers: [RaffleService],
})
export class RaffleComponent implements OnInit {

	raffle: any = {	};
	loading = false;
	raffleEntries:any[] = [];
	raffleCounts:any;
	tempWinner:any;

	structure: IField[] = [
		{
			name: 'Give Away Name',
			_id: 'giveAwayName',
			type: FieldTypeEnum.Input,
			required: true,
		}, {
			name: 'Start Time',
			_id: 'start',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.Date,
			pickerType: 'datetime',
			required: true,
		}, {
			name: 'Give Away Link',
			_id: 'giveAwayLink',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.URL,
			required: true,
		},  {
			name: 'Give Away Image',
			_id: 'giveAwayImage',
			type: FieldTypeEnum.Input,
		}, {
			name: 'Created',
			_id: 'createdAt',
			disabled: true,
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.Date,
		},
	];

	constructor(
		private service: RaffleService,
		private userService: UserService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private fs: AngularFirestore
	) {
	}

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const raffle$ = id !== 'new' ? this.service.getById$(id) : of(this.raffle);
		const raffleEntries$ = id !== 'new' ? this.service.getRaffleEntries$(id) : of(this.raffleEntries);

		if( id ) this.service.filters.raffle = id;
		const raffleCounts$ = id !== 'new' ? this.service.getRaffleCounts() : of(this.raffleCounts);
		combineLatest(raffle$, raffleEntries$, raffleCounts$).subscribe((data:any) => {
			[this.raffle, this.raffleEntries, this.raffleCounts] = data;
			this.pageTitleService.setTitle(this.raffle._id ? 'Edit Raffle' : 'New Raffle');
			this.raffleCounts = this.raffleCounts[0];

			if( this.raffle.winner )
				this._updateEntries();

			this.loading = false;
		});
	}

	save(raffle) {
		raffle = { ...raffle, _id: this.raffle._id };
		this.service.save$(raffle).subscribe(
			data => {
				this.raffle = data;
				this.pageTitleService.setTitle(this.raffle.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.raffle._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}

	startRaffle() {
		this.service.startRaffle(this.raffle);
	}

	determinWinner(loop=50) {
		if( loop == 0 ) {
			this._selectWinner();
		} else {
			this.tempWinner = this.raffleEntries[Math.floor(Math.random()*this.raffleEntries.length)].user;
			setTimeout(() => {
				this.determinWinner(--loop);
			}, (51-loop)*5);
		}
	}

	private _selectWinner() {
		const userProbability = this.raffleEntries.map(x => x.tickets/this.raffleCounts.ticketCounts);
		const winningEntry = this.raffleEntries[this._getRandomIndexByProbability(userProbability)];
		this.raffle.winner = winningEntry.user;
		this._updateEntries();
	}

	private _updateEntries() {
		this.raffleEntries = this.raffleEntries.filter((x) => {
			x.user.tickets = x.tickets;
			if( x.user._id === this.raffle.winner._id )
				this.raffle.winner.tickets = x.tickets;
			else
				return x;
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
