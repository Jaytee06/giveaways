import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class TriviaService extends BaseService {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/trivia`, { headers: this.headers }).pipe(
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
}
