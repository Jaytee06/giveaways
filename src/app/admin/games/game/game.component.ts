import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {combineLatest, of} from "rxjs";
import {GameService} from "../../../services/games.service";

@Component({
	selector: 'app-product',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
	providers: [GameService],
})
export class GameComponent implements OnInit {


	game: any = {};
	loading = false;

	structure: IField[] = [
		{
			name: 'Name',
			_id: 'name',
			type: FieldTypeEnum.Input,
			required: true,
		},{
			name: 'Description',
			_id: 'description',
			type: FieldTypeEnum.Textarea,
			required: true,
		},
		{
			name: 'External Site',
			_id: 'externalSite',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel:'name',
			options: [
				{_id: 'softGames', name: 'Soft Games'},
				{_id: 'famobiGames', name: 'famobi Games'},
			]
		}, {
			name: 'External Game Tag',
			_id: 'externalGameTag',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Thumbnail Image',
			_id: 'thumb',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.URL,
			required: true,
		},
		{
			name: 'Thumbnail Image Big',
			_id: 'thumbBig',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.URL,
			required: true,
		},{
			name: 'Game Tags (comma seperated)',
			_id: 'tags',
			type: FieldTypeEnum.Input,
		},{
			name: 'Ticket Reward Amount',
			_id: 'rewardAmount',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
		},
		{
			name: 'Active',
			_id: 'active',
			type: FieldTypeEnum.SimpleCheckBox,
		},
	];

	constructor(
		private service: GameService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const game$ = id !== 'new' ? this.service.getById$(id) : of(this.game);
		combineLatest(game$).subscribe((data) => {
			[this.game] = data;
			this.pageTitleService.setTitle(this.game._id ? 'Edit Game' : 'New Game');
			this.loading = false;
		});
	}

	addScreenShot() {
		if( !this.game.screenShots )
			this.game.screenShots = [];

		this.game.screenShots.push('');
	}

	save(game) {
		game = { ...game, _id: this.game._id, screenShots: this.game.screenShots };

		if( game.screenShots && game.screenShots.length ) {
			game.screenShots = game.screenShots.filter(x => x != '');
		}

		this.service.save$(game).subscribe(
			data => {
				this.game = data;
				this.pageTitleService.setTitle(this.game.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.game._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}
}
