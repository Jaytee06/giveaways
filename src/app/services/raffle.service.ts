import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import {AngularFirestore} from "@angular/fire/firestore";
import * as moment from "moment";

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
		console.log(raffle);
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

	startRaffle(raffle) {

		const time = moment().utc().format();
		let obj:any = {didStart: time};
		// ending it if it was already started
		if( raffle.didStart ) {
			obj = {didEnd: time};
			raffle.didEnd = new Date(time);
			this._chargeRaffleTickets(raffle).subscribe(() => {});
		} else {
			raffle.didStart = new Date(time);
		}
		this._updateFireStore(raffle, obj);
		this.save$(raffle).subscribe(() => {});
	}

	getRaffleCounts() {
		return this.http.get(`${this.getBaseUrl()}/raffle/counts?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getRaffleEntries$(raffleId) {
		return this.http.get(`${this.getBaseUrl()}/raffle/${raffleId}/raffle-entry`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getRaffleEntryById$(raffleId, raffleEntryId) {
		return this.http.get(`${this.getBaseUrl()}/raffle/${raffleId}/raffle-entry/${raffleEntryId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	saveRaffleEntry$(raffleEntry) {
		if (raffleEntry) {
			if (raffleEntry._id) {
				return this._updateRaffleEntry$(raffleEntry);
			}
			return this._createRaffleEntry$(raffleEntry);
		}
		return of(null);
	}

	deleteRaffleEntry$(raffleId, raffleEntryId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/raffle/${raffleId}/raffle-entry/${raffleEntryId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _createRaffleEntry$(raffleEntry) {
		return this.http.post(`${this.getBaseUrl()}/raffle/${raffleEntry.raffle}/raffle-entry`, raffleEntry, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _updateRaffleEntry$(raffleEntry) {
		return this.http.put(`${this.getBaseUrl()}/raffle/${raffleEntry.raffle}/raffle-entry/${raffleEntry._id}`, raffleEntry, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _updateFireStore(raffle, obj) {
		this.fs.collection('raffles').doc(raffle._id).update(obj).catch((error) => {
			this.fs.collection('raffles').doc(raffle._id).set(obj);
		});
	}

	private _chargeRaffleTickets(raffle) {
		return this.http.get(`${this.getBaseUrl()}/raffle/${raffle._id}/charge-tickets`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}
}
