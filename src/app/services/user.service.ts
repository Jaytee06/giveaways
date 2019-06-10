import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class UserService extends BaseService{

    private headers = {};

    constructor(private http: HttpClient, private baseService: BaseService) {
        super();
        this.headers = new HttpHeaders(this.baseService.getHeaders());
    }

    loginUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/auth/login`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError('loginUser', []))
        );
    }

    registerUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/auth/register`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError('registerUser', []))
        );
    }

    createUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/user`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError('registerUser', []))
        );
    }

    getUsers() {
        return this.http.get(`${this.baseService.getBaseUrl()}/user`, {headers: this.headers}).pipe(
            catchError(this.handleError('getUsers', []))
        );
    }

    getUser(userId) {
        return this.http.get(`${this.baseService.getBaseUrl()}/user/${userId}`, {headers: this.headers}).pipe(
            catchError(this.handleError('getUser', []))
        );
    }

    updateUser(userData) {
        return this.http.put(`${this.baseService.getBaseUrl()}/user/${userData._id}`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError('registerUser', []))
        );
    }
}
