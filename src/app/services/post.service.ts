import {Injectable, NgZone} from '@angular/core';
import { of } from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";
import {catchError, tap} from "rxjs/operators";
import {BaseService} from "./base.service";

@Injectable()
export class PostService extends BaseService {
	
	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get(`${this.getBaseUrl()}/post?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getBlogPosts$() {
		return this.http.get(`${this.getBaseUrl()}/public/blog?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getByTitle$(title) {
		return this.http.get(`${this.getBaseUrl()}/public/blog/${title}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(postId) {
		return this.http.get(`${this.getBaseUrl()}/post/${postId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(post) {
		if (post) {
			if (post._id) {
				return this._update$(post);
			}
			return this._create$(post);
		}
		return of(null);
	}

	delete$(postId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/post/${postId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Post Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	getCount$() {
		return this.http.get(`${this.getBaseUrl()}/post/count?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	addComment(postId, comment) {
		return this.http.post(`${this.getBaseUrl()}/post/${postId}/comments`, comment, { headers: this.headers }).pipe(
			tap(() => this.success('Comment Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	getComments(postId) {
		return this.http.get(`${this.getBaseUrl()}/public/blog/${postId}/comments`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	private _create$(post) {
		return this.http.post(`${this.getBaseUrl()}/post`, post, { headers: this.headers }).pipe(
			tap(() => this.success('Post Created!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(post) {
		return this.http.put(`${this.getBaseUrl()}/post/${post._id}`, post, { headers: this.headers }).pipe(
			tap(() => this.success('Post Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
