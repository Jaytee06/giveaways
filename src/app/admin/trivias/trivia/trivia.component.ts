import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {TriviaService} from '../../../services/trivia.service';
import {UserService} from "../../../services/user.service";
import {combineLatest, of} from "rxjs";

import * as moment from 'moment';
import {AngularFirestore} from "@angular/fire/firestore";

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
		{ _id:"perQuestion", text:"Per Question", dependents:['ticketsPerQuestions']},
		{ _id:"winners", text:"Split Between Winners", dependents:['tickets']},
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
	questionResults = [];

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
			required: true
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
			name: 'Intermission Between Questions (s)',
			_id: 'intermissionDuration',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
		}, {
			name: 'Beginning Intermission (s)',
			_id: 'startingDuration',
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
			originallyHidden: true,
		}, {
			name: 'Tickets Per Question',
			_id: 'ticketsPerQuestions',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
			originallyHidden: true,
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
		private fs: AngularFirestore
	) {
	}

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const trivia$ = id !== 'new' ? this.service.getById$(id) : of(this.trivia);
		combineLatest(trivia$).subscribe((data) => {
			[this.trivia] = data;
			if( this.trivia.didStart ) {
				this.structure.forEach((field) => {
					field.disabled = true;
				});
			}
			if( this.trivia._id ) {
				this.fs.collection('quizzes').doc(this.trivia._id).valueChanges().subscribe((d: any) => {
					if (d) {
						this.trivia = {...this.trivia, ...d};

						// fix timestamps
						if( this.trivia.didStart && this.trivia.didStart.seconds ) {
							this.trivia.didStart = moment(new Date(this.trivia.didStart.seconds*1000)).format();
						}

						if( !this.trivia.intermission && this.trivia.countDown == 0 ) {
							const question = this.questionResults[this.trivia.currentQuestion-1];
							this._calculateQuestionResults(question, this.trivia.currentQuestion-1);
						} else if( this.trivia.didEnd ) {
							this.questionResults.forEach((question, i) => {
								this._calculateQuestionResults(question, i);
							});
						}
					}
				});

				this.trivia.questions.forEach((q) => {
					this.questionResults.push({
						pendingUsers: [],
						correctUsers: [],
						wrongUsers: []
					});
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

	startQuiz() {
		this.service.startQuiz(this.trivia);
	}

	delete() {
		this.service.delete$(this.trivia._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}

	private _calculateQuestionResults(question, questionNum) {
		Object.keys(this.trivia.users).forEach((key) => {
			const user = this.trivia.users[key];
			if( !user.questions[questionNum].complete ) {
				if( question.pendingUsers.find(x => x._id === user._id) === undefined ) question.pendingUsers.push(user);
			} else if( user.questions[questionNum].correct ) {
				if( question.correctUsers.find(x => x._id === user._id) === undefined ) question.correctUsers.push(user);
			} else {
				if( question.wrongUsers.find(x => x._id === user._id) === undefined ) question.wrongUsers.push(user);
			}
		});
	}

	test() {
		this.service.test$().subscribe(() => {});
	}
}
