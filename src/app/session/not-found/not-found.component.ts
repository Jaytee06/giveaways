import { Component, ViewEncapsulation } from '@angular/core';
import {Router} from "@angular/router";

@Component({
   selector: 'ms-not-found',
   templateUrl:'./not-found-component.html',
   styleUrls: ['./not-found-component.scss'],
   encapsulation: ViewEncapsulation.None,
})

export class NotFoundComponent {
	
  username: string;

  constructor(
    private router: Router
  ) { }
  onSubmit() {
    this.router.navigate ( ['/'] );
  }
	
}



