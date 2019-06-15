import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {TriviaService} from '../../../services/trivia.service';
import {UserService} from "../../../services/user.service";
import {combineLatest, of} from "rxjs";

import * as moment from 'moment';

@Component({
	selector: 'app-trivia',
	templateUrl: './trivia.component.html',
	styleUrls: ['./trivia.component.scss'],
	providers: [TriviaService],
})
export class TriviaComponent implements OnInit {

	categories = [
		{ _id:"any", text:"Any Category"},
		{ _id:"9", text:"General Knowledge"},
		{ _id:"10", text:"Entertainment: Books"},
		{ _id:"11", text:"Entertainment: Film"},
		{ _id:"12", text:"Entertainment: Music"},
		{ _id:"13", text:"Entertainment: Musicals &amp; Theatres"},
		{ _id:"14", text:"Entertainment: Television"},
		{ _id:"15", text:"Entertainment: Video Games"},
		{ _id:"16", text:"Entertainment: Board Games"},
		{ _id:"17", text:"Science &amp; Nature"},
		{ _id:"18", text:"Science: Computers"},
		{ _id:"19", text:"Science: Mathematics"},
		{ _id:"20", text:"Mythology"},
		{ _id:"21", text:"Sports"},
		{ _id:"22", text:"Geography"},
		{ _id:"23", text:"History"},
		{ _id:"24", text:"Politics"},
		{ _id:"25", text:"Art"},
		{ _id:"26", text:"Celebrities"},
		{ _id:"27", text:"Animals"},
		{ _id:"28", text:"Vehicles"},
		{ _id:"29", text:"Entertainment: Comics"},
		{ _id:"30", text:"Science: Gadgets"},
		{ _id:"31", text:"Entertainment: Japanese Anime &amp; Manga"},
		{ _id:"32", text:"Entertainment: Cartoon &amp; Animations"},
	];

	questionDifficulties = [
		{ _id:"any", text:"Any"},
		{ _id:"easy", text:"Easy"},
		{ _id:"medium", text:"Medium"},
		{ _id:"hard", text:"Hard"},
	];

	questionTypes = [
		{ _id:"any", text:"Any"},
		{ _id:"multiple", text:"Multiple Choice"},
		{ _id:"boolean", text:"True / False"},
	];

	payoutTypes = [
		{ _id:"perQuestion", text:"Per Question"},
		{ _id:"winners", text:"Split Between Winners"},
	];

	trivia: any = {
		numOfQuestions: 10,
		category: "any",
		difficulty: "any",
		questionType: "any",
		questionDuration: "60",
	};
	loading = false;
	hasHappened = true;

	structure: IField[] = [
		{
			name: 'Number of Questions',
			_id: 'numOfQuestions',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
		}, {
			name: 'Category',
			_id: 'category',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'text',
			options: this.categories,
			required: true,
		}, {
			name: 'Difficulty',
			_id: 'difficulty',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'text',
			options: this.questionDifficulties,
			required: true,
		}, {
			name: 'Question Type',
			_id: 'questionType',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'text',
			options: this.questionTypes,
			required: true,
		}, {
			name: 'Start Time',
			_id: 'start',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.Date,
			pickerType: 'datetime',
			required: true,
		}, {
			name: 'Question Time Limit (s)',
			_id: 'questionDuration',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
		}, {
			name: 'Payout Type',
			_id: 'payoutType',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'text',
			options: this.payoutTypes,
			required: true,
		}, {
			name: 'Ticket Payout',
			_id: 'tickets',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
		}, {
			name: 'Tickets Per Question',
			_id: 'ticketsPerQuestions',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
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
		private service: TriviaService,
		private userService: UserService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const trivia$ = id !== 'new' ? this.service.getById$(id) : of(this.trivia);
		combineLatest(trivia$).subscribe((data) => {
			[this.trivia] = data;
			if( moment().isAfter(moment(this.trivia.start)) ) {
				this.hasHappened = false;
				this.structure.forEach((field) => {
					field.disabled = true;
				});
			}
			this.pageTitleService.setTitle(this.trivia._id ? 'Edit Trivia Quiz' : 'New Trivia Quiz');
			this.loading = false;
		});
	}

	generateQuestions() {
		this.service.generateQuestions(this.trivia._id).subscribe((data) => {
			this.trivia.questions = <Array<any>>data;
		});
	}

	save(trivia) {
		trivia = { ...trivia, _id: this.trivia._id };
		this.service.save$(trivia).subscribe(
			data => {
				this.trivia = data;
				this.pageTitleService.setTitle(this.trivia.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.trivia._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}
}
