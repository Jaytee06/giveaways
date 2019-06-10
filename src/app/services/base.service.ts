import {environment} from "../../environments/environment";
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
@Injectable()
export class BaseService {

    constructor() {}

    public getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        };
    }


    public getBaseUrl() {
        return ( environment.apiBaseUrl && environment.apiBaseUrl != '' ? environment.apiBaseUrl+'/api' : 'localhost:4200/api' );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    public handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            //this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}