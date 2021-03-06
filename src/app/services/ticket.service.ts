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
		return this.http.get<Array<any>>(`${this.getBaseUrl()}/ticket?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(ticketId) {
		return this.http.get(`${this.getBaseUrl()}/ticket/${ticketId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getCount() {
		return this.http.get(`${this.getBaseUrl()}/ticket/count?` + this.getParams(), { headers: this.headers }).pipe(
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

	myTickets(userId) {
		return this.http.get(`${this.getBaseUrl()}/ticket/my-tickets/${userId}?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getCounts$() {
		return this.http.get(`${this.getBaseUrl()}/ticket/counts?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(ticket) {
		return this.http.post(`${this.getBaseUrl()}/ticket`, ticket, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket(s) Applied!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(ticket) {
		return this.http.put(`${this.getBaseUrl()}/ticket/${ticket._id}`, ticket, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}

	getOpportunities$() {
		return this.http.get<Array<any>>(`${this.getBaseUrl()}/ticket-opportunity?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getOpportunityById$(ticketOppId) {
		return this.http.get(`${this.getBaseUrl()}/ticket-opportunity/${ticketOppId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	saveOpportunity$(ticketOpp) {
		if (ticketOpp) {
			if (ticketOpp._id) {
				return this._updateOpportunity$(ticketOpp);
			}
			return this._createOpportunity$(ticketOpp);
		}
		return of(null);
	}

	deleteOpportunity$(ticketOppId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/ticket-opportunity/${ticketOppId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket Opportunity Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _createOpportunity$(ticketOpp) {
		return this.http.post(`${this.getBaseUrl()}/ticket-opportunity`, ticketOpp, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket Opportunity Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _updateOpportunity$(ticketOpp) {
		return this.http.put(`${this.getBaseUrl()}/ticket-opportunity/${ticketOpp._id}`, ticketOpp, { headers: this.headers }).pipe(
			tap(() => this.success('Ticket Opportunity Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
