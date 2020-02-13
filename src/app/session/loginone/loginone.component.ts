import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from '../../services/user.service';
import { environment } from '../../../environments/environment';
import {RaffleService} from "../../services/raffle.service";

@Component({
   selector: 'ms-loginone-session',
   templateUrl:'./loginone-component.html',
   styleUrls: ['./loginone-component.scss'],
    providers:[UserService, RaffleService],
   // encapsulation: ViewEncapsulation.None,
})
export class LoginoneComponent implements OnInit {

	userCount = 0;
	maxUserCount = 10;

    email: string;
    password: string;

    lead: any = {};

    raffle;

    constructor(
        private service: UserService,
        private raffleService: RaffleService,
        private router: Router
    ) {
    }

    ngOnInit() {
    	this.service.getUsersCounts().subscribe((d:any[]) => {
    		if( d && d.length )
    		this.userCount = d[0].count;
		});

    	this.raffleService.currentRaffles(true).subscribe((raffles:any[]) => {
    		if( raffles.length ) {
				this.raffle = raffles[raffles.length - 1];
				this.updateRaffleTime();
			}
		});
	}

	updateRaffleTime() {
		let showTime = this.raffle.start;
		this.raffle.status = "Starting";
		if( this.raffle.didStart ) {
			this.raffle.status = "In Progress";
			showTime = this.raffle.didStart;
			if( this.raffle.didEnd ) {
				this.raffle.status = "Ended";
				showTime = this.raffle.didEnd;
			}
		}
		this.raffle.displayTime = this.service.formatDate(showTime, false, true);
	}

    loginone() {

        window.location.href = environment.apiBaseUrl + '/api/auth/twitch';

        // const user = {
        //     email: this.email,
        //     password: this.password
        // }
        //
        // this.service.loginUser(user).subscribe((data: any) => {
        //     console.log(data);
        //     localStorage.setItem('user', data.user);
        //     localStorage.setItem('token', data.token);
        //     localStorage.setItem('tokenExpire', JSON.stringify(moment().add(8, 'hours'))); // TODO:: This is temp logic, come up with a better way.
        //     this.router.navigate(['/']);
        // }, error => {
        // });
    }

	saveEmail() {
    	this.service.createUserLead({email:this.email}).subscribe((lead) => {
    		this.lead = lead;
		});
	}

}



