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
			required: true,
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
		combineLatest(raffle$).subscribe((data) => {
			[this.raffle] = data;
			this.pageTitleService.setTitle(this.raffle._id ? 'Edit Raffle' : 'New Raffle');
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
}
