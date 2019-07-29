import {Injectable, NgZone} from '@angular/core';
import { of } from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";
import {catchError, tap} from "rxjs/operators";
import {BaseService} from "./base.service";

@Injectable()
export class StatusService extends BaseService {
	
	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/status?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(statusId) {
		return this.http.get(`${this.getBaseUrl()}/status/${statusId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(status) {
		if (status) {
			if (status._id) {
				return this._update$(status);
			}
			return this._create$(status);
		}
		return of(null);
	}

	delete$(statusId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/status/${statusId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Status Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	getCount$() {
		return this.http.get(`${this.getBaseUrl()}/status/count?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(status) {
		return this.http.post(`${this.getBaseUrl()}/status`, status, { headers: this.headers }).pipe(
			tap(() => this.success('Status Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(status) {
		return this.http.put(`${this.getBaseUrl()}/status/${status._id}`, status, { headers: this.headers }).pipe(
			tap(() => this.success('Status Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
