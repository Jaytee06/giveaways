import {Injectable, NgZone} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import { BaseService } from './base.service';
import {of} from 'rxjs';
import {MatSnackBar} from "@angular/material";

@Injectable()
export class UserService extends BaseService{

    private headers = {};
    private currentUser: any;

    userId = localStorage.getItem('user');

    constructor(private http: HttpClient, private baseService: BaseService, private sb: MatSnackBar, private z: NgZone) {
        super(sb, z);
        this.headers = new HttpHeaders(this.baseService.getHeaders());
    }

    loginUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/auth/login`, userData, {headers: this.headers});
    }

    loginUserTwitch(userData) {
        return this.http.get(`${this.baseService.getBaseUrl()}/auth/twitch`).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    registerUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/auth/register`, userData, {headers: this.headers});
    }

    createUser(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/user`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    createUserLead(userData) {
        return this.http.post(`${this.baseService.getBaseUrl()}/auth/user-lead`, userData, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    getUsers() {
        return this.http.get<Array<any>>(`${this.baseService.getBaseUrl()}/user?${this.getParams()}`, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    getUser(userId) {
        return this.http.get(`${this.baseService.getBaseUrl()}/user/${userId}`, {headers: this.headers}).pipe(
            tap((user: any) => {
                if( user._id === this.userId )
                    this.currentUser = user;
            }),
            catchError(this.handleError.bind(this)),
        );
    }

    getUsersCounts() {
        return this.http.get(`${this.baseService.getBaseUrl()}/auth/user-counts`, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    updateUser(userData) {
        return this.http.put(`${this.baseService.getBaseUrl()}/user/${userData._id}`, userData, {headers: this.headers}).pipe(
            tap(() => {this.success('User updated.');}),
            catchError(this.handleError.bind(this)),
        );
    }

    addReferrer(userId, referralToken) {
        return this.http.post(`${this.baseService.getBaseUrl()}/user/${userId}/add-referrer`, {referralToken}, {headers: this.headers}).pipe(
            tap(() => {this.success('You updated your referrer.');}),
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

    checkSubscription(userId) {
        return this.http.get(`${this.baseService.getBaseUrl()}/user/${userId}/check-subscription`, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    recoverPassword$(email) {
        return this.http.get( `${this.baseService.getBaseUrl()}/auth/recover-password?email=${email}`).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    setNewPassword$(password, token) {
        return this.http.post(`${this.baseService.getBaseUrl()}/auth/set-new-password`, { password }, {headers: new HttpHeaders(this.baseService.getHeaders(token))}).pipe(
            tap(() =>{this.success('Password has been reset')}),
            catchError(this.handleError.bind(this)),
        );
    }
}
