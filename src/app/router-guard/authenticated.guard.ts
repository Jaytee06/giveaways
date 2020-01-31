import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import * as moment from 'moment';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor( private router: Router) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        console.log('canActivate', route.queryParams);
        if( route.queryParams.user && route.queryParams.token ) {
            console.log('Set Tokens');
            localStorage.setItem('user', route.queryParams.user);
            localStorage.setItem('token', route.queryParams.token);
            localStorage.setItem('tokenExpire', JSON.stringify(moment().add(8, 'hours'))); // TODO:: This is temp logic, come up with a better way.
            this.router.navigate(["/"]);
            return false;
        }

        const token = localStorage.getItem('token');
        const tokenExpire = JSON.parse(localStorage.getItem('tokenExpire'));
        if (!token || token == 'undefined' || token.trim() == '' || moment().add(6, 'hours').isAfter(moment(tokenExpire))) {
            this.router.navigate(["/session/loginone"]);
            return false;
        } else {
            return true;
        }
    }
}