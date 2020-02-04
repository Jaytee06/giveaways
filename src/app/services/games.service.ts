import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import {AngularFirestore} from "@angular/fire/firestore";
import * as moment from "moment";

@Injectable()
export class GameService extends BaseService {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone, private fs: AngularFirestore) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/game?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(gameId) {
		return this.http.get(`${this.getBaseUrl()}/game/${gameId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(game) {
		if (game) {
			if (game._id) {
				return this._update$(game);
			}
			return this._create$(game);
		}
		return of(null);
	}

	delete$(gameId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/game/${gameId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Game Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(game) {
		return this.http.post(`${this.getBaseUrl()}/game`, game, { headers: this.headers }).pipe(
			tap(() => this.success('Game Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(game) {
		return this.http.put(`${this.getBaseUrl()}/game/${game._id}`, game, { headers: this.headers }).pipe(
			tap(() => this.success('Game Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
