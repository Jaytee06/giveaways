import { Injectable } from '@angular/core';

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

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'DASHBOARD',
    type: 'link',
    icon: 'icon-speedometer icons',
  },
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
  {
    state: 'admin',
    name: 'ADMIN',
    type: 'sub',
    icon: 'fa fa-building',
    children: [
      {state: 'users', name: 'USERS', icon:'fa fa-users'},
    ]
  }
];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }
  add(menu: any) {
    MENUITEMS.push(menu);
  }
}
