import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import {AngularFirestore} from "@angular/fire/firestore";

import * as moment from 'moment';

@Injectable()
export class TriviaService extends BaseService {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone, private fs: AngularFirestore) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/trivia`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	test$() {
		return this.http.get(`${this.getBaseUrl()}/trivia/test`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(triviaId) {
		return this.http.get(`${this.getBaseUrl()}/trivia/${triviaId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(trivia) {
		if (trivia) {
			if (trivia._id) {
				return this._update$(trivia);
			}
			return this._create$(trivia);
		}
		return of(null);
	}

	delete$(triviaId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/trivia/${triviaId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Trivia Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	generateQuestions(triviaId) {
		return this.http.get(`${this.getBaseUrl()}/trivia/${triviaId}/generate-questions`, { headers: this.headers }).pipe(
			tap(() => this.success('Trivia Questions Generated!')),
			catchError(this.handleError.bind(this)),
		);
	}

	currentTrivia() {
		return this.http.get(`${this.getBaseUrl()}/trivia/current`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	userJoinTrivia(trivia, user) {
		return this.http.post(`${this.getBaseUrl()}/trivia/${trivia._id}/join-user/${user._id}`, {}, { headers: this.headers }).pipe(
			tap(() => {
				const obj = {users:{}};
				const userObj = {fullname: user.fullname, questions:{}};
				for (let i = 0; i < trivia.numOfQuestions; i++) {
					userObj.questions[i] = {complete: false, correct: false};
				}
				obj.users[user._id] = userObj;
				this._updateFireStore({_id:trivia._id}, obj);
			}),
			catchError(this.handleError.bind(this)),
		);
	}

	getUserTrivia(userTriviaId) {
		return this.http.get(`${this.getBaseUrl()}/trivia/user-trivia/${userTriviaId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	updateUserTrivia(userTrivia) {
		return this.http.put(`${this.getBaseUrl()}/trivia/user-trivia/${userTrivia._id}`, userTrivia, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	findUserTrivia(triviaId, userId) {
		return this.http.get(`${this.getBaseUrl()}/trivia/${triviaId}/user-trivia/${userId}?` + this.getParams(), { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	startQuiz(trivia) {

		const time = moment().utc().format();
		let obj:any = {didStart: time, countDown:trivia.startingDuration, currentQuestion:0, intermission:true};
		// ending it if it was already started
		if( trivia.didStart ) {
			obj = {didEnd: time};
			trivia.didEnd = new Date(time);
			this._calculateTickets(trivia).subscribe(() => {});
		} else {
			trivia.didStart = new Date(time);
		}
		this._updateFireStore(trivia, obj);
		this.save$(trivia).subscribe(() => {});
	}

	private _triviaQuestionCountdown(trivia, countDownObj) {
		countDownObj.countDown--;
		if( countDownObj.countDown < 0 ) {
			if( countDownObj.intermission ) {
				countDownObj.currentQuestion++;
				countDownObj.countDown = trivia.questionDuration;
			} else {
				countDownObj.countDown = trivia.intermissionDuration;
			}
			countDownObj.intermission = !countDownObj.intermission;
		}
		if( countDownObj.currentQuestion <= trivia.numOfQuestions ) {
			this.fs.collection('quizzes').doc(trivia._id).update(countDownObj);
			setTimeout(() => {
				this._triviaQuestionCountdown(trivia, countDownObj);
			}, 1000);
		}
	}

	private _calculateTickets(trivia) {
		return this.http.get(`${this.getBaseUrl()}/trivia/${trivia._id}/calculate-tickets`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(trivia) {
		return this.http.post(`${this.getBaseUrl()}/trivia`, trivia, { headers: this.headers }).pipe(
			tap(() => this.success('Trivia Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(trivia) {
		return this.http.put(`${this.getBaseUrl()}/trivia/${trivia._id}`, trivia, { headers: this.headers }).pipe(
			tap(() => this.success('Trivia Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _updateFireStore(trivia, obj) {
		this.fs.collection('quizzes').doc(trivia._id).update(obj).then(() => {
			if( obj.didStart ) this._triviaQuestionCountdown(trivia, obj);
		}).catch((error) => {
			this.fs.collection('quizzes').doc(trivia._id).set(obj).then(() => {
				if( obj.didStart ) this._triviaQuestionCountdown(trivia, obj);
			});
		});
	}
}
