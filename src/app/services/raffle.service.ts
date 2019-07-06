import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable()
export class RaffleService extends BaseService {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone, private fs: AngularFirestore) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/raffle`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(raffleId) {
		return this.http.get(`${this.getBaseUrl()}/raffle/${raffleId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(raffle) {
		if (raffle) {
			if (raffle._id) {
				return this._update$(raffle);
			}
			return this._create$(raffle);
		}
		return of(null);
	}

	delete$(raffleId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/raffle/${raffleId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Raffle Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	currentRaffles() {
		return this.http.get(`${this.getBaseUrl()}/raffle/current`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(raffle) {
		return this.http.post(`${this.getBaseUrl()}/raffle`, raffle, { headers: this.headers }).pipe(
			tap(() => this.success('Raffle Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(raffle) {
		return this.http.put(`${this.getBaseUrl()}/raffle/${raffle._id}`, raffle, { headers: this.headers }).pipe(
			tap(() => this.success('Raffle Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
