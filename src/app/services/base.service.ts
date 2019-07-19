import {environment} from "../../environments/environment";
import {Injectable, NgZone} from '@angular/core';
import {Observable, ObservableInput, of, throwError} from 'rxjs';
import {MatSnackBar} from "@angular/material";
import * as moment from "moment";

import * as _$ from 'jquery';
const $ = _$;

@Injectable()
export class BaseService {

    filters: any = {};
    customErrorMessage = '';

    constructor(public snackBar: MatSnackBar, private zone: NgZone) {}

    public getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        };
    }


    public getBaseUrl() {
        return ( environment.apiBaseUrl && environment.apiBaseUrl != '' ? environment.apiBaseUrl+'/api' : 'localhost:4300/api' );
    }

    getParams() {
        return $.param(this.filters);
    }

    success(message) {
        this.snackBar.open(message, '', { duration: 3000, verticalPosition: 'top', panelClass: 'text-success' });
    }

    handleError(error: any, caught: Observable<Object>): ObservableInput<any> {
        let errorMessage = '';
        if (error.error) {
            if (typeof error.error == 'string') {
                errorMessage = `Error: ${error.error}`;
            } else {
                // client-side error
                errorMessage = `Error: ${error.error.message}`;
            }
        } else {
            // server-side error
            errorMessage = `Error: ${error.statusText}\nMessage: ${error.message}`;
        }
        if (this.customErrorMessage != '') errorMessage = this.customErrorMessage;

        switch (error.status) {
            case 401:
            case 400:
            default:
                this.zone.run(() => {
                    let snackBarRef = this.snackBar.open(errorMessage, 'Ok', {
                        verticalPosition: 'top',
                        panelClass: 'text-danger',
                    });
                    snackBarRef.onAction().subscribe(() => {
                    });
                });

        }

        return throwError(errorMessage);
    }

    throwError(status, message) {
        const error = {
            status: status,
            error: { message: message },
        };
        this.handleError(error, null);
    }

    getStates() {
        return [
            {
                'name': 'Alabama',
                'abbreviation': 'AL',
            },
            {
                'name': 'Alaska',
                'abbreviation': 'AK',
            },
            {
                'name': 'American Samoa',
                'abbreviation': 'AS',
            },
            {
                'name': 'Arizona',
                'abbreviation': 'AZ',
            },
            {
                'name': 'Arkansas',
                'abbreviation': 'AR',
            },
            {
                'name': 'California',
                'abbreviation': 'CA',
            },
            {
                'name': 'Colorado',
                'abbreviation': 'CO',
            },
            {
                'name': 'Connecticut',
                'abbreviation': 'CT',
            },
            {
                'name': 'Delaware',
                'abbreviation': 'DE',
            },
            {
                'name': 'District Of Columbia',
                'abbreviation': 'DC',
            },
            {
                'name': 'Federated States Of Micronesia',
                'abbreviation': 'FM',
            },
            {
                'name': 'Florida',
                'abbreviation': 'FL',
            },
            {
                'name': 'Georgia',
                'abbreviation': 'GA',
            },
            {
                'name': 'Guam',
                'abbreviation': 'GU',
            },
            {
                'name': 'Hawaii',
                'abbreviation': 'HI',
            },
            {
                'name': 'Idaho',
                'abbreviation': 'ID',
            },
            {
                'name': 'Illinois',
                'abbreviation': 'IL',
            },
            {
                'name': 'Indiana',
                'abbreviation': 'IN',
            },
            {
                'name': 'Iowa',
                'abbreviation': 'IA',
            },
            {
                'name': 'Kansas',
                'abbreviation': 'KS',
            },
            {
                'name': 'Kentucky',
                'abbreviation': 'KY',
            },
            {
                'name': 'Louisiana',
                'abbreviation': 'LA',
            },
            {
                'name': 'Maine',
                'abbreviation': 'ME',
            },
            {
                'name': 'Marshall Islands',
                'abbreviation': 'MH',
            },
            {
                'name': 'Maryland',
                'abbreviation': 'MD',
            },
            {
                'name': 'Massachusetts',
                'abbreviation': 'MA',
            },
            {
                'name': 'Michigan',
                'abbreviation': 'MI',
            },
            {
                'name': 'Minnesota',
                'abbreviation': 'MN',
            },
            {
                'name': 'Mississippi',
                'abbreviation': 'MS',
            },
            {
                'name': 'Missouri',
                'abbreviation': 'MO',
            },
            {
                'name': 'Montana',
                'abbreviation': 'MT',
            },
            {
                'name': 'Nebraska',
                'abbreviation': 'NE',
            },
            {
                'name': 'Nevada',
                'abbreviation': 'NV',
            },
            {
                'name': 'New Hampshire',
                'abbreviation': 'NH',
            },
            {
                'name': 'New Jersey',
                'abbreviation': 'NJ',
            },
            {
                'name': 'New Mexico',
                'abbreviation': 'NM',
            },
            {
                'name': 'New York',
                'abbreviation': 'NY',
            },
            {
                'name': 'North Carolina',
                'abbreviation': 'NC',
            },
            {
                'name': 'North Dakota',
                'abbreviation': 'ND',
            },
            {
                'name': 'Northern Mariana Islands',
                'abbreviation': 'MP',
            },
            {
                'name': 'Ohio',
                'abbreviation': 'OH',
            },
            {
                'name': 'Oklahoma',
                'abbreviation': 'OK',
            },
            {
                'name': 'Oregon',
                'abbreviation': 'OR',
            },
            {
                'name': 'Palau',
                'abbreviation': 'PW',
            },
            {
                'name': 'Pennsylvania',
                'abbreviation': 'PA',
            },
            {
                'name': 'Puerto Rico',
                'abbreviation': 'PR',
            },
            {
                'name': 'Rhode Island',
                'abbreviation': 'RI',
            },
            {
                'name': 'South Carolina',
                'abbreviation': 'SC',
            },
            {
                'name': 'South Dakota',
                'abbreviation': 'SD',
            },
            {
                'name': 'Tennessee',
                'abbreviation': 'TN',
            },
            {
                'name': 'Texas',
                'abbreviation': 'TX',
            },
            {
                'name': 'Utah',
                'abbreviation': 'UT',
            },
            {
                'name': 'Vermont',
                'abbreviation': 'VT',
            },
            {
                'name': 'Virgin Islands',
                'abbreviation': 'VI',
            },
            {
                'name': 'Virginia',
                'abbreviation': 'VA',
            },
            {
                'name': 'Washington',
                'abbreviation': 'WA',
            },
            {
                'name': 'West Virginia',
                'abbreviation': 'WV',
            },
            {
                'name': 'Wisconsin',
                'abbreviation': 'WI',
            },
            {
                'name': 'Wyoming',
                'abbreviation': 'WY',
            },
        ];
    }

    formatDate(date, addTime = false, timeAgo = false) {
        if (addTime)
            return moment(date).format('MM/DD/YYYY h:mm a');
        else if( timeAgo )
            return moment(date).fromNow();
        else
            return moment(date).format('MM/DD/YYYY');
    }
}