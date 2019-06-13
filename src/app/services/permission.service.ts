import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IPermission, IService } from '../core/interfaces';
import { BaseService } from './base.service';

@Injectable()
export class PermissionService extends BaseService implements IService<IPermission> {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get<IPermission[]>(`${this.getBaseUrl()}/permission`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(permissionId) {
		return this.http.get<IPermission>(`${this.getBaseUrl()}/permission/${permissionId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(permission: IPermission) {
		if (permission) {
			if (permission._id) {
				return this._update$(permission);
			}
			return this._create$(permission);
		}
		return of(null);
	}

	delete$(permissionId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/permission/${permissionId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Permission Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(permission) {
		return this.http.post(`${this.getBaseUrl()}/permission`, permission, { headers: this.headers }).pipe(
			tap(() => this.success('Permission Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(permission) {
		return this.http.put(`${this.getBaseUrl()}/permission/${permission._id}`, permission, { headers: this.headers }).pipe(
			tap(() => this.success('Permission Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
