import {Injectable, NgZone} from '@angular/core';
import { of } from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";
import {catchError, tap} from "rxjs/operators";
import {BaseService} from "./base.service";

@Injectable()
export class CategoryService extends BaseService {
	
	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/category?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(categoryId) {
		return this.http.get(`${this.getBaseUrl()}/category/${categoryId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(category) {
		if (category) {
			if (category._id) {
				return this._update$(category);
			}
			return this._create$(category);
		}
		return of(null);
	}

	delete$(categoryId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/category/${categoryId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Category Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(category) {
		return this.http.post(`${this.getBaseUrl()}/category`, category, { headers: this.headers }).pipe(
			tap(() => this.success('Category Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(category) {
		return this.http.put(`${this.getBaseUrl()}/category/${category._id}`, category, { headers: this.headers }).pipe(
			tap(() => this.success('Category Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
