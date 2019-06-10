import {Component, EventEmitter, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {PageTitleService} from '../../core/page-title/page-title.service';

@Component({
   selector: 'ms-loginone-session',
   templateUrl:'./users-component.html',
   styleUrls: ['./users-component.scss'],
    providers:[UserService],
   encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {

    tableData: any = {};

    constructor(
        private pageTitleService: PageTitleService,
        private service: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.pageTitleService.setTitle("Users");

        this.tableData.columns = [
            {key: 'select', name: 'select'},
            {key: 'fullname', name: 'Name'},
            {key: 'email', name: 'Email'},
            {key: 'roleList', name: 'Roles'},
            {key: 'createdAt', name: 'Created'},
            {key: '_id', name: 'ID'},
        ];
        this.tableData.displayedColumns = ['select', 'fullname', 'email', 'roleList', 'createdAt', '_id'];

        this.tableData.dataSource = new EventEmitter();
        this.service.getUsers().subscribe(
            (data: any[]) => {

                // prep data for table view
                data.forEach(function (user) {
                    user.roleList = '';
                    if (user.roles && user.roles.length > 0) {
                        user.roles.forEach(function (role) {
                            user.roleList += role.name + ', ';
                        });
                    }
                    if (user.roleList != '') user.roleList = user.roleList.substr(0, user.roleList.length - 2);
                    if (user.prime_user) user.lastVisitDate = user.prime_user.last_login_date;
                });

                this.tableData.dataSource.emit(data);
            }
        );

    }

    userSelected(user) {
        this.router.navigate([user._id], {relativeTo:this.activatedRoute});
    }

    rowSelected(row) {
        console.log(row);
    }

    addUser() {
        this.router.navigate(['new'], {relativeTo:this.activatedRoute});
    }
}



