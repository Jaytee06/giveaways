import { Injectable } from '@angular/core';
import { UserService } from '../../../services/user.service';
import {catchError} from "rxjs/operators";

export interface ChildrenItems {
  state: string;
  name: string;
  icon: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  children?: ChildrenItems[];
}

let MENUITEMS = [
  // {
  //   state: 'dashboard',
  //   name: 'DASHBOARD',
  //   type: 'link',
  //   icon: 'icon-speedometer icons',
  // },
  // {
  //   state: 'pages',
  //   name: 'BLANK',
  //   type: 'link',
  //   icon: 'icon-book-open icons',
  // },
  // {
  //   state: 'session',
  //   name: 'SESSIONS',
  //   type: 'sub',
  //   icon: 'icon-login icons',
  //   children: [
  //     {state: 'loginone', name: 'LOGIN'},
  //     {state: 'register', name: 'REGISTER'},
  //     {state: 'forgot-password', name: 'FORGOT'},
  //     {state: 'coming-soon', name: 'COMING SOON'},
  //     {state: 'lockscreen', name: 'LOCKSCREEN'},
  //     {state: 'subscribes', name: 'SUBSCRIBES'},
  //     {state: 'undermaintance', name: 'UNDER MAINTANCE'},
  //     {state: 'not-found', name: '404'},
  //   ]
  // },
];

@Injectable({
  providedIn: 'root',
})
export class MenuItems {

  user: any;

  constructor(
      private userService: UserService
  ) {
  }

  setupMenu() {

    MENUITEMS = [
      {
        state: 'dashboard',
        name: 'DASHBOARD',
        type: 'link',
        icon: 'icon-speedometer icons',
      },
    ];

    const userId = localStorage.getItem('user');
    if (userId && userId != '') {
      this.userService.getCurrentUser().subscribe(user => {
        this.user = user;
        this.populateMenu();
      });
    }
  }

  populateMenu() {

    let isSuperAdmin = false;
    if (this.user.roles.find(x => x.slug == 'super_admin') !== undefined) isSuperAdmin = true;

    const adminMenus = [];
    let hasPermissions = [];
    if (this.user.roles) {
      this.user.roles.forEach(role => {
        const permissions = role.permissions.map(x => {
          if (x.canCreate == true) return x.permission.subject;
        });
        if (permissions) hasPermissions = [...permissions];
      });
    }

    if (isSuperAdmin || hasPermissions.indexOf('permission') > -1) adminMenus.push({
      state: 'permissions',
      name: 'Permissions',
      icon: 'fa fa-lock',
    });
    if (isSuperAdmin || hasPermissions.indexOf('role') > -1) adminMenus.push({
      state: 'roles',
      name: 'Roles',
      icon: 'fa fa-address-card',
    });
    if (isSuperAdmin || hasPermissions.indexOf('user') > -1) adminMenus.push({
      state: 'users',
      name: 'Users',
      icon: 'fa fa-user',
    });

    if (adminMenus.length > 0) {
      this.add({
        state: 'admin',
        name: 'Admin',
        type: 'sub',
        icon: 'fa fa-desktop',
        children: adminMenus,
      });
    }
    //}
  }

  getAll(): Menu[] {
    return MENUITEMS;
  }

  add(menu: any) {
    MENUITEMS.push(menu);
  }
}
