import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {ActivatedRoute, Router} from "@angular/router";
import {TriviaService} from "../services/trivia.service";
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
	selector: 'trivia',
	templateUrl: './trivia-component.html',
	styleUrls: ['./trivia-component.scss'],
})
export class TriviaComponent implements OnInit {

	trivia:any = {};
	user:any = {};
	userTrivia;
	correctCount = 0;

	timerStructure:any = {radius:20, backgroundPadding:1, backgroundColor:'#FF6347', outerStrokeColor:'#FFF', innerStrokeColor:'#FFF', outerStrokeWidth:3, titleColor:'#FFF', unitsColor:'#FFF', showInnerStroke:false};

	constructor(
		private service: TriviaService,
		private userService: UserService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private fs: AngularFirestore
	) {}

	ngOnInit() {

		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const trivia$ = id !== 'new' ? this.service.getById$(id) : of(this.trivia);
		const user$ = this.userService.getCurrentUser();
		combineLatest(trivia$, user$).subscribe((data) => {
			[this.trivia, this.user] = data;
			this.trivia.startDate = this.service.formatDate(this.trivia.start, true);
			this.fs.collection('quizzes').doc(this.trivia._id).valueChanges().subscribe((d:any) => {
				if( d ) {
					this.trivia = {...this.trivia, ...d};
					this.timerStructure.percent = (this.trivia.countDown / this.trivia.questionDuration)*100;
					this.timerStructure.title = this.trivia.countDown;
					if( this.trivia.countDown <= 5 ) {
						this.timerStructure.backgroundColor = '#FF6347';
					} else {
						this.timerStructure.backgroundColor = '#78C000';
					}

					if( !this.trivia.intermission && this.trivia.countDown == 0 && this.userTrivia )
						this.saveAnswers(this.trivia.currentQuestion - 1);

					if( this.trivia.status == "Starting" || this.trivia.status == "Waiting" || this.trivia.didEnd )
						this.updateTimes(this.trivia, false);
				}
			});
			this.updateTimes(this.trivia, true);

			this.service.findUserTrivia(this.trivia._id, this.user._id).subscribe((d:any[]) => {
				if(d && d.length) {
					this.userTrivia = d[0];
					this.correctCount = 0;
					this.userTrivia.questions.forEach((q) => {if(q.correct) this.correctCount++;});
				}
			});

			this.userService.checkSubscription(this.user._id).subscribe((d) => {
				this.user.isSubscribed = d;
			});
		});
	}

	joinQuiz() {
		this.service.userJoinTrivia(this.trivia, this.user).subscribe((d) => { this.userTrivia = d;});
	}

	saveAnswers(questionNum) {
		this.service.updateUserTrivia(this.userTrivia).subscribe((d: any) => {
			this.userTrivia = {...this.userTrivia, ...d}
			this.userTrivia.questions[questionNum].complete = true;
			this.correctCount = 0;
			this.userTrivia.questions.forEach((q) => {if(q.correct) this.correctCount++;});

			const obj = {};
			obj["users."+this.user._id+".questions."+questionNum+".complete"] = true;
			obj["users."+this.user._id+".questions."+questionNum+".correct"] = this.userTrivia.questions[questionNum].correct;
			this.fs.collection('quizzes').doc(this.trivia._id).update(obj);
		});
	}

	updateTimes(trivia, doTimeout) {
		this.trivia = trivia;
		this.trivia.status = "Starting";
		if( this.trivia.didStart ) {
			this.trivia.status = "In Progress";
			this.trivia.displayTime = this.service.formatDate(this.trivia.didStart, false, true);
			if( this.trivia.didEnd ) {
				this.trivia.status = "Ended";
				this.trivia.displayTime = this.service.formatDate(this.trivia.didEnd, false, true);
			}
		} else if( moment().isAfter(trivia.start) ) {
			this.trivia.status = "Waiting";
		} else {
			this.trivia.displayTime = this.service.formatDate(this.trivia.start, false, true);
		}

		if( doTimeout ) {
			setTimeout(() => {
				this.updateTimes(this.trivia, doTimeout);
			}, 60000);
		}
	}

	notify(should) {
		this.userTrivia.receiveNotifications = should;
		this.service.updateUserTrivia(this.userTrivia).subscribe(() => {});
	}
}














