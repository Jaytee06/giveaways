import {environment} from "../../environments/environment";
import {Injectable, NgZone} from '@angular/core';
import {Observable, ObservableInput, of, throwError} from 'rxjs';
import {MatSnackBar} from "@angular/material";
import * as moment from "moment";

import * as _$ from 'jquery';
import {TimezonesService} from "./timezones.service";
const $ = _$;

@Injectable()
export class BaseService {

    filters: any = {};
    storedFilters: any = {};
    customErrorMessage = '';

    constructor(public snackBar: MatSnackBar, private zone: NgZone) {}

    public checkToken() {
        const token = localStorage.getItem('token');
        const tokenExpire = localStorage.getItem('tokenExpire').replace(/\"/g, '');
        return token && moment().isBefore(moment(tokenExpire));
    }

    public getHeaders(customToken?) {
        const token = customToken ? customToken : localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        };
    }

    changeStoredFilters(filters) {
        this.storedFilters = { ...this.storedFilters, ...filters };
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

    formatDate(date, addTime = false, shortDate = false, timeAgo = false, timezone = 'America/Denver') {
        const format = `${shortDate ? 'M/D/YY' : 'MM/DD/YYYY'}${addTime ? ' h:mm a' : ''}`;

        return timeAgo ? TimezonesService.applyTimezoneOffset(moment(date), timezone).fromNow() : TimezonesService.applyTimezoneOffset(moment(date), timezone).format(format);
    }

    get timeZoneOffset(): number {
        const userSettings = JSON.parse(localStorage.getItem('userSettings'));
        return userSettings && userSettings.timeZoneOffset || -360; // MST default by request
    }
}