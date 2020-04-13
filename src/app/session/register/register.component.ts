import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'ms-register-session',
    templateUrl: './register-component.html',
    styleUrls: ['./register-component.scss'],
    providers: [ ],
    encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {

    fname: string;
    lname: string;
    email: string;
    password: string;
    passwordConfirm: string;

    constructor(
        private service: UserService,
        private router: Router
    ) {
    }

    register() {
        const user = {
            fullname: this.fname+' '+this.lname,
            email: this.email,
            password: this.password,
            repeatPassword: this.passwordConfirm
        };

        this.service.registerUser(user).subscribe((data: any) => {
            localStorage.setItem('token', data.token);
            this.router.navigate(['/']);
        }, error => {
        });
    }
}



