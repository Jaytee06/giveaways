import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../core/page-title/page-title.service';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'unsubscribers',
    templateUrl: './unsubscribe.component.html',
    styleUrls: ['./unsubscribe.component.scss'],
    providers:[]
})
export class UnsubscribeComponent implements OnInit {

    found = false;
    loading = true;

  constructor(private pageTitleService: PageTitleService, private activatedRoute: ActivatedRoute, private userServce: UserService) { }

  ngOnInit() {
  	  this.pageTitleService.setTitle("Unsubscribe");

  	  if( this.activatedRoute.snapshot.params.token ) {
  	      this.userServce.filters.emailToken = this.activatedRoute.snapshot.params.token;
  	      this.userServce.getUsers().subscribe((users) => {
  	          if( users && users.length ) {
  	              let user = users[0];
  	              user.receiveEmails = false;
  	             this.userServce.updateUser(user).subscribe((d) => {
  	                 this.found = false;
  	                 this.loading = false;
                 });
              } else {
  	              this.loading = false;
              }
          });
      } else {
  	      this.loading = false;
      }
  }

}
