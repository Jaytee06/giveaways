import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {UserService} from "../../../services/user.service";
import {combineLatest, of} from "rxjs";

import {AngularFirestore} from "@angular/fire/firestore";
import {RaffleService} from "../../../services/raffle.service";
import {StatusService} from "../../../services/status.service";

@Component({
	selector: 'app-raffle',
	templateUrl: './raffle.component.html',
	styleUrls: ['./raffle.component.scss'],
	providers: [RaffleService, StatusService],
})
export class RaffleComponent implements OnInit {

	raffle: any = {	};
	loading = false;
	raffleEntries:any[] = [];
	allRaffleEntries:any[] = [];
	raffleCounts:any;
	tempWinner:any;
	statuses:any[] = [];

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
		}, {
			name: 'Give Away Image',
			_id: 'giveAwayImage',
			type: FieldTypeEnum.Input,
		}, {
			name: 'Monetary Value',
			_id: 'monetaryValue',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.Currency
		}, {
			name: 'Fullfillment Status',
			_id: 'ffStatus',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel:'name',
			options: this.statuses
		}, {
			name: 'Can Deliver Digitally',
			_id: 'canDigitalDeliver',
			type: FieldTypeEnum.SimpleCheckBox,
		}, {
			name: 'Can Ship',
			_id: 'canShip',
			type: FieldTypeEnum.SimpleCheckBox,
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
		private statusService: StatusService,
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
		const raffleEntries$ = id !== 'new' ? this.service.getRaffleEntries$(id) : of(this.allRaffleEntries);

		this.statusService.filters.type = 'Raffle';
		const statuses$ = this.statusService.get$();

		if( id ) this.service.filters.raffle = id;
		const raffleCounts$ = id !== 'new' ? this.service.getRaffleCounts() : of(this.raffleCounts);
		combineLatest(raffle$, raffleEntries$, raffleCounts$, statuses$).subscribe((data:any) => {
			[this.raffle, this.allRaffleEntries, this.raffleCounts, this.statuses] = data;
			this.pageTitleService.setTitle(this.raffle._id ? 'Edit Raffle' : 'New Raffle');

			this.structure.find(x => x._id === 'ffStatus').options = this.statuses;

			if( !this.raffle._id ) {
				this.raffle.ffStatus = this.statuses[0]._id;
			}

			if( this.raffleCounts && this.raffleCounts.length )
				this.raffleCounts = this.raffleCounts[0];

			this.fs.collection('raffles').doc(this.raffle._id).valueChanges().subscribe((d:any) => {
				if( d ) {
					combineLatest(raffleEntries$, raffleCounts$).subscribe((updateData:any) => {
						[this.allRaffleEntries, this.raffleCounts] = updateData;

						if( this.raffleCounts && this.raffleCounts.length )
							this.raffleCounts = this.raffleCounts[0];
					});
				}
			});

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

	redraw() {
		this.raffle.winner = null;
		this._updateEntries();
		this.determinWinner();
	}

	determinWinner(loop=50) {
		if( loop == 0 ) {
			this._selectWinner();
		} else {
			this.tempWinner = this.allRaffleEntries[Math.floor(Math.random()*this.allRaffleEntries.length)].user;
			setTimeout(() => {
				this.determinWinner(--loop);
			}, (51-loop)*5);
		}
	}

	private _selectWinner() {
		const userProbability = this.allRaffleEntries.map(x => x.tickets/this.raffleCounts.ticketCounts);
		const winningEntry = this.allRaffleEntries[this._getRandomIndexByProbability(userProbability)];
		this.raffle.winner = winningEntry.user;
		this.raffle.ffStatus = "5d3df5acb71bc344fda79c11"; //unclaimed
		this._updateEntries();
	}

	private _updateEntries() {
		this.raffleEntries = this.allRaffleEntries.filter((x) => {
			x.user.tickets = x.tickets;
			if( this.raffle.winner && x.user._id === this.raffle.winner._id )
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
