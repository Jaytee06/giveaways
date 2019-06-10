import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import * as moment from 'moment';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor( private router: Router) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = localStorage.getItem('token');
        const tokenExpire = JSON.parse(localStorage.getItem('tokenExpire'));
        if (!token || token == 'undefined' || token.trim() == '' || moment().isAfter(moment(tokenExpire))) {
            this.router.navigate(["/session/loginone"]);
            return false;
        } else {
            return true;
        }
    }
}