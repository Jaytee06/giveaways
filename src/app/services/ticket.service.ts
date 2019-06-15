import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class TicketService extends BaseService {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/ticket`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(ticketId) {
		return this.http.get(`${this.getBaseUrl()}/ticket/${ticketId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(ticket) {
		if (ticket) {
			if (ticket._id) {
				return this._update$(ticket);
			}
			return this._create$(ticket);
		}
		return of(null);
	}

	delete$(ticketId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/ticket/${ticketId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(ticket) {
		return this.http.post(`${this.getBaseUrl()}/ticket`, ticket, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(ticket) {
		return this.http.put(`${this.getBaseUrl()}/ticket/${ticket._id}`, ticket, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
