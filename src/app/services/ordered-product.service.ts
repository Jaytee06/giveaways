import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class OrderedProductService extends BaseService {

	private headers = {};
	customMessage = '';

	constructor(private http: HttpClient, private sb: MatSnackBar, private z: NgZone) {
		super(sb, z);
		this.headers = new HttpHeaders(this.getHeaders());
	}

	get$() {
		return this.http.get<Array<any>>(`${this.getBaseUrl()}/ordered-product?${this.getParams()}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	getById$(orderedProductId) {
		return this.http.get(`${this.getBaseUrl()}/ordered-product/${orderedProductId}`, { headers: this.headers }).pipe(
			catchError(this.handleError.bind(this)),
		);
	}

	save$(orderedProduct) {
		if (orderedProduct) {
			if (orderedProduct._id) {
				return this._update$(orderedProduct);
			}
			return this._create$(orderedProduct);
		}
		return of(null);
	}

	delete$(orderedProductId) {
		return this.http.delete<null>(`${this.getBaseUrl()}/ordered-product/${orderedProductId}`, { headers: this.headers }).pipe(
			tap(() => this.success('Ordered Product Removed.')),
			catchError(this.handleError.bind(this)),
		);
	}

	// myOrderedProducts(userId) {
	// 	return this.http.get(`${this.getBaseUrl()}/orderedProduct/my-orderedProducts/${userId}`, { headers: this.headers }).pipe(
	// 		catchError(this.handleError.bind(this)),
	// 	);
	// }
	//
	// getCounts$() {
	// 	return this.http.get(`${this.getBaseUrl()}/orderedProduct/counts?${this.getParams()}`, { headers: this.headers }).pipe(
	// 		catchError(this.handleError.bind(this)),
	// 	);
	// }

	private _create$(orderedProduct) {
		return this.http.post(`${this.getBaseUrl()}/ordered-product`, orderedProduct, { headers: this.headers }).pipe(
			tap(() => {
				this.success(this.customMessage || 'Ordered Product(s) Applied!');
				this.customMessage = '';
			}),
			catchError(this.handleError.bind(this)),
		);
	}

	private _update$(orderedProduct) {
		return this.http.put(`${this.getBaseUrl()}/ordered-product/${orderedProduct._id}`, orderedProduct, { headers: this.headers }).pipe(
			tap(() => this.success('Ordered Product Updated!')),
			catchError(this.handleError.bind(this)),
		);
	}
}
