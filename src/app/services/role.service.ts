import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IRole, IService } from '../core/interfaces';
import { BaseService } from './base.service';

@Injectable()
export class RoleService extends BaseService implements IService<IRole> {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get<IRole[]>(`${this.getBaseUrl()}/role`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(roleId) {
		return this.http.get<IRole>(`${this.getBaseUrl()}/role/${roleId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(role: IRole) {
		if (role) {
			if (role._id) {
				return this._update$(role);
			}
			return this._create$(role);
		}
		return of(null);
	}

	delete$(roleId: string) {
		return this.http.delete<null>(`${this.getBaseUrl()}/role/${roleId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Role Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(role: IRole) {
		return this.http.post(`${this.getBaseUrl()}/role`, role, { headers: this.headers }).pipe(
			tap(() => this.success('Role Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(role: IRole) {
		return this.http.put(`${this.getBaseUrl()}/role/${role._id}`, role, { headers: this.headers }).pipe(
			tap(() => this.success('Role Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
