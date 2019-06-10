import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class PartnerService extends BaseService{

    private headers = {};

    constructor(private http: HttpClient, private baseService: BaseService) {
        super();
        this.headers = new HttpHeaders(this.baseService.getHeaders());
    }

    getPartners() {
        return this.http.get(`${this.baseService.getBaseUrl()}/partner`, {headers: this.headers}).pipe(
            catchError(this.handleError('getPartners', []))
        );
    }

    getPartner(partnerId) {
        return this.http.get(`${this.baseService.getBaseUrl()}/partner/${partnerId}`, {headers: this.headers}).pipe(
            catchError(this.handleError('getPartner', []))
        );
    }
}
