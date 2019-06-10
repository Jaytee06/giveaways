import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class RoleService extends BaseService{

    private headers = {};

    constructor(private http: HttpClient, private baseService: BaseService) {
        super();
        this.headers = new HttpHeaders(this.baseService.getHeaders());
    }

    getRoles() {
        return this.http.get(`${this.baseService.getBaseUrl()}/role`, {headers: this.headers}).pipe(
            catchError(this.handleError('getRoles', []))
        );
    }

    getRole(roleId) {
        return this.http.get(`${this.baseService.getBaseUrl()}/role/${roleId}`, {headers: this.headers}).pipe(
            catchError(this.handleError('getRole', []))
        );
    }
}
