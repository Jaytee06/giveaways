import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class ExportsService extends BaseService {

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	private headers = {};

	get$(): Observable<any[]> {
		return this.http.get<any[]>(`${this.getBaseUrl()}/export/?` + this.getParams(), { headers: this.getHeaders(true) }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(id: string): Observable<any> {
		return this.http.get<any>(`${this.getBaseUrl()}/export/${id}?` + this.getParams(), { headers: this.getHeaders(true) }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(exportObj) {
		if (exportObj) {
			if (exportObj._id) {
				return this._update$(exportObj);
			}
			return this._create$(exportObj);
		}
		return of(null);
	}

	delete$(id: string) {
		return this.http.delete(`${this.getBaseUrl()}/export/${id}`, { headers: this.getHeaders(true) }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	export(entity, params) {
		const snackBarRef = this.sb.open('Building export...', '', {
			verticalPosition: 'top',
			panelClass: 'text-info',
		});

		Object.keys(params).forEach(key => {
			if (!params[key]) delete params[key];
		});

		let exportName = params.exportItem.name || entity;
		if (params.exportItem) {
			params.exportItem = JSON.stringify(params.exportItem);
		}

		return this.http.get(`${this.getBaseUrl()}/${entity}/export`, {
			headers: this.headers,
			responseType: 'text',
			params,
		}).pipe(
			tap((data) => {
				this.download(`${exportName} export.csv`, data);
				snackBarRef.dismiss();
			}),
			catchError(this.handleError.bind(this)),
		);
	}

	download(filename, data) {
		//let csvContent = 'data:text/csv;charset=utf-8,';
//		csvContent += data;

//		let encodedUri = encodeURI(csvContent);
		let csvLink = document.createElement('a');
		// csvLink.setAttribute('href', encodedUri);
		csvLink.setAttribute('href', data); // S3 URL
		csvLink.setAttribute('download', filename);
		csvLink.setAttribute('target', '_blank');
		document.getElementById('exportContainer').appendChild(csvLink); // required for firefox
		csvLink.click();

	}

	private _create$(exportObj) {
		return this.http.post(`${this.getBaseUrl()}/export`, exportObj, { headers: this.headers }).pipe(
			tap(() => this.success('Export Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(exportObj) {
		return this.http.put(`${this.getBaseUrl()}/export/${exportObj._id}`, exportObj, { headers: this.headers }).pipe(
			tap(() => this.success('Export Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
