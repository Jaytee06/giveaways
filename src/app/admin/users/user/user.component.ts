import { Component, OnInit } from '@angular/core';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PartnerService} from '../../../services/partner.service';
import {RoleService} from '../../../services/role.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
    providers:[UserService, PartnerService, RoleService]
})
export class UserComponent implements OnInit {

    roles = [];
    partners = [];
    user: any = {};
    selectedRoles = [];

    firstName = '';
    lastName = '';

    constructor(
          private service: UserService,
          private partnerService: PartnerService,
          private roleService: RoleService,
          private pageTitleService: PageTitleService,
          private router: Router,
          private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        const self = this;
        this.activatedRoute.params.subscribe(
            params => {
                if (params['id'] != 'new') {
                    self.service.getUser(params['id']).subscribe(
                        data => {
                            self.user = data;

                            const names = self.user.fullname.split(' ');
                            self.firstName = names[0];
                            if( names[1] ) self.lastName = names[1];
                            self.pageTitleService.setTitle(self.user.fullname);
                            this.populateRoles();
                        }
                    );
                } else {
                    self.user.active = true;
                    self.pageTitleService.setTitle('New User');
                }
            }
        );

        this.partnerService.getPartners().subscribe(
            data => {
                this.partners = <Array<any>>data;
            }
        );

        this.roleService.get$().subscribe(
            data => {
                this.roles = <Array<any>>data;
                this.populateRoles();
            }
        );
    }

    populateRoles() {
        if( this.roles.length == 0 || !this.user ) return;

        this.selectedRoles = [];
        if( !this.user.roles ) this.user.roles = [];
        this.user.roles.forEach(roleId => {
           this.selectedRoles.push(this.roles.find(x => {if(x._id == roleId) return x;}));
        });
    }

    createUser() {
        this.user.fullname = this.firstName+' '+this.lastName;

        this.service.createUser(this.user).subscribe(
            data => {
                this.user = data;
                this.pageTitleService.setTitle(this.user.fullname);
            }
        );
    }

    updateUser() {

    }

    cancel() {
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }

    rolesChanged(roles) {
        this.user.roles = roles.map(x => x._id);
    }

}
