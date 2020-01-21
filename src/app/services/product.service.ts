import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class ProductService extends BaseService {

	private headers = {};

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get<Array<any>>(`${this.getBaseUrl()}/product?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(productId) {
		return this.http.get(`${this.getBaseUrl()}/product/${productId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(product) {
		if (product) {
			if (product._id) {
				return this._update$(product);
			}
			return this._create$(product);
		}
		return of(null);
	}

	delete$(productId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/product/${productId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Product Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	// myProducts(userId) {
	// 	return this.http.get(`${this.getBaseUrl()}/product/my-products/${userId}`, { headers: this.headers }).pipe(
	// 		catchError(this.handleError.bind(this)),
	// 	);
	// }
	//
	// getCounts$() {
	// 	return this.http.get(`${this.getBaseUrl()}/product/counts?${this.getParams()}`, { headers: this.headers }).pipe(
	// 		catchError(this.handleError.bind(this)),
	// 	);
	// }

	private _create$(product) {
		return this.http.post(`${this.getBaseUrl()}/product`, product, { headers: this.headers }).pipe(
			tap(() => this.success('Product(s) Applied!')),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(product) {
		return this.http.put(`${this.getBaseUrl()}/product/${product._id}`, product, { headers: this.headers }).pipe(
			tap(() => this.success('Product Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
