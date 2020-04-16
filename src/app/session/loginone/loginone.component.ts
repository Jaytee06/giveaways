import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from '../../services/user.service';
import { environment } from '../../../environments/environment';
import {RaffleService} from "../../services/raffle.service";


import * as moment from "moment-timezone";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {VisibilityService} from "../../services/visibility.service";
import {filter, take} from "rxjs/operators";


@Component({
   selector: 'ms-loginone-session',
   templateUrl:'./loginone-component.html',
   styleUrls: ['./loginone-component.scss'],
    providers:[RaffleService, VisibilityService],
   // encapsulation: ViewEncapsulation.None,
})
export class LoginoneComponent implements OnInit {

	@ViewChild("referralProgram") referralProgram:ElementRef;
	addYoutube: Observable<boolean>;

	userCount = 0;
	maxUserCount = 10;

    modalRegister = false;
	fname: string;
	lname: string;
	email: string;
	password: string;
	passwordConfirm: string;

    lead: any = {};
	form: FormGroup;
	token: string;
	loginError = '';
	resetError = '';

    raffle;
	raffleCountDown = 'd:H:mm:ss';
	modalRef;

    constructor(
        private service: UserService,
        private raffleService: RaffleService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
        private modalService: NgbModal,
		public visibilityService: VisibilityService
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

		this.token = this.route.snapshot.queryParams.token;

		this.form = this.fb.group({
			// email: ['', [Validators.required, Validators.email]],
			// password: ['', [Validators.required]],
			email: [''],
			password: [''],
		});

		this.addYoutube = this.visibilityService
			.elementInSight(this.referralProgram)
			.pipe(filter(visible => visible), take(1));
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
		if( this.raffle.status === 'Starting' ) {
			this.runCountDown();
		} else {
			this.raffle.displayTime = this.service.formatDate(showTime, false, true);
		}
	}

	runCountDown() {
		if( this.raffle ) {
			let diff = moment(moment.utc(this.raffle.start).diff(moment.utc())).utc().subtract(1, 'day');
			if( diff._i < 86400000 )
				this.raffleCountDown = diff.format('HH:mm:ss');
			else
				this.raffleCountDown = diff.format('D:HH:mm:ss');
		}

		setTimeout(() =>{
			this.runCountDown();
		}, 1000);
	}

    loginTwitch() {
        window.location.href = environment.apiBaseUrl + '/api/auth/twitch';
    }

    loginone() {

        const user = {
            email: this.email,
            password: this.password
        };

        this.service.loginUser(user).subscribe((data: any) => {
            localStorage.setItem('user', data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('tokenExpire', JSON.stringify(moment().add(8, 'hours'))); // TODO:: This is temp logic, come up with a better way.
			this.close();
            this.router.navigate(['/']);
        }, error => {
			this.loginError = 'Invalid Username or Password.';
        });
    }

	register() {
		const user = {
			fullname: this.fname+' '+this.lname,
			email: this.email,
			password: this.password,
			repeatPassword: this.passwordConfirm
		};

		this.service.registerUser(user).subscribe((data: any) => {
			localStorage.setItem('user', data.user);
			localStorage.setItem('token', data.token);
			localStorage.setItem('tokenExpire', JSON.stringify(moment().add(8, 'hours'))); // TODO:: This is temp logic, come up with a better way.
			this.close();
			this.router.navigate(['/']);
		}, error => {
			this.loginError = error.error.message;
			console.log('register error', error);
		});
	}

	saveEmail() {
    	this.service.createUserLead({email:this.email}).subscribe((lead) => {
    		this.lead = lead;
		});
	}

    open(content) {
        this.modalRef = this.modalService.open(content);
		this.modalRef.result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(`Dismissed ${reason}`);
        });
    }

    close() {
    	this.modalRef.close();
	}

	send() {
		// todo: need a popup showing the error to the user
		if (!this.form.valid) {
			this.resetError = 'Form has errors';
			return;
		}

		if (this.token) {
			this.service.setNewPassword$(this.form.value.password, this.token).subscribe( result => {
				if (result) {
					this.router.navigate(['/session/loginone']).then();
				}
			});

		} else {
			this.service.recoverPassword$(this.form.value.email).subscribe(
				result => console.log(result),
			);
		}
		// this.router.navigate(['/']);
	}
}



