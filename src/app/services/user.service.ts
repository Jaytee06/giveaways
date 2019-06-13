import {Injectable, NgZone} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import {of} from 'rxjs';
import {MatSnackBar} from "@angular/material";

@Injectable()
export class UserService extends BaseService{

    private headers = {};
    private currentUser: any;

    constructor(private http: HttpClient, private baseService: BaseService, private sb: MatSnackBar, private z: NgZone) {
        super(sb, z);
        this.headers = new HttpHeaders(this.baseService.getHeaders());
    }

    loginUser(userData) {
        return this.http.get(`${this.baseService.getBaseUrl()}/auth/twitch`).pipe(
            catchError(this.handleError.bind(this)),
        );
        // return this.http.post(`${this.baseService.getBaseUrl()}/auth/login`, userData, {headers: this.headers}).pipe(
        //     catchError(this.handleError('loginUser', []))
        // );
    }

    registerUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/auth/register`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    createUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/user`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    getUsers() {
        return this.http.get(`${this.baseService.getBaseUrl()}/user`, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    getUser(userId) {
        return this.http.get(`${this.baseService.getBaseUrl()}/user/${userId}`, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    updateUser(userData) {
        return this.http.put(`${this.baseService.getBaseUrl()}/user/${userData._id}`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    getCurrentUser() {
        const userId = localStorage.getItem('user');
        if (userId && userId != '' && this.currentUser == null) {
            return this.getUser(userId);
        } else if (this.currentUser != null) {
            return of(this.currentUser);
        } else {
            return of(false);
        }
    }
}
