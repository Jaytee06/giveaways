import {Injectable, NgZone} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import {MatSnackBar} from "@angular/material";

@Injectable()
export class PartnerService extends BaseService{

    private headers = {};

    constructor(private http: HttpClient, private baseService: BaseService, private sb: MatSnackBar, private z: NgZone) {
        super(sb, z);
        this.headers = new HttpHeaders(this.baseService.getHeaders());
    }

    getPartners() {
        return this.http.get(`${this.baseService.getBaseUrl()}/partner`, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }

    getPartner(partnerId) {
        return this.http.get(`${this.baseService.getBaseUrl()}/partner/${partnerId}`, {headers: this.headers}).pipe(
            catchError(this.handleError.bind(this)),
        );
    }
}
