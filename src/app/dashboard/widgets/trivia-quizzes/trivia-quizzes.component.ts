import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {TriviaService} from "../../../services/trivia.service";
import * as moment from "moment";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'trivia-quizzes-widget',
	templateUrl: './trivia-quizzes-component.html',
	styleUrls: ['./trivia-quizzes-component.scss'],
})
export class TriviaQuizzesComponent implements OnInit {

	quizzes = [];

	constructor(private service: TriviaService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {

	}

	ngOnInit() {
		this.service.currentTrivia().subscribe((data) => {
			this.updateTimes(data);
		});
	}

	quizClicked(quiz) {
		this.router.navigate(['../../trivia-quiz', quiz._id], {relativeTo:this.activatedRoute});
	}

	updateTimes(quizzes) {
		this.quizzes = quizzes.map((q) => {
			q.status = "Starting";
			if( q.didStart ) {
				q.status = "In Progress";
				if( q.didEnd ) q.status = "Ended";
			}
			q.displayTime = this.service.formatDate(q.start, false, true); return q;
		});
		setTimeout(() => {
			this.updateTimes(this.quizzes);
		}, 60000);
	}
}














