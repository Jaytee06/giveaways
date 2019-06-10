import { Component, ViewEncapsulation } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from '../../services/user.service';
import * as moment from 'moment';

@Component({
   selector: 'ms-loginone-session',
   templateUrl:'./loginone-component.html',
   styleUrls: ['./loginone-component.scss'],
    providers:[UserService],
   encapsulation: ViewEncapsulation.None,
})
export class LoginoneComponent {
	
  email: string;
  password: string;

  constructor(
      private service: UserService,
    private router: Router
  ) { }

  loginone() {

      const user = {
          email: this.email,
          password: this.password
      }

      this.service.loginUser(user).subscribe((data: any) => {
          localStorage.setItem('user', data.user);
          localStorage.setItem('token', data.token);
          localStorage.setItem('tokenExpire', JSON.stringify(moment().add(8, 'hours'))); // TODO:: This is temp logic, come up with a better way.
          this.router.navigate(['/']);
      }, error => {
      });
  }
	
}



