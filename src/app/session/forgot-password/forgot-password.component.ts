import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {Router} from "@angular/router";

@Component({
   selector: 'ms-forgot-password',
   templateUrl:'./forgot-password-component.html',
   styleUrls: ['./forgot-password-component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent {
	
	email: string;
  password: string;

  constructor(
    private router: Router
  ) { }

  send() {
    this.router.navigate(['/']);
  }

}



