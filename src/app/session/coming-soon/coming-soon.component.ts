import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {Router} from "@angular/router";

@Component({
   selector: 'ms-coming-soon',
   templateUrl:'./coming-soon-component.html',
   styleUrls: ['./coming-soon-component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class ComingSoonComponent {
	
	email: string;
  password: string;

  constructor(
    private router: Router
  ) { }

  send() {
    this.router.navigate(['/']);
  }

}



