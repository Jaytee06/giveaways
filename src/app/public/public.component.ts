import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    HostListener,
    ViewEncapsulation,
    OnChanges,
    SimpleChange
} from '@angular/core';
import { MenuItems } from '../core/menu/menu-items/menu-items';
import { BreadcrumbService} from 'ng5-breadcrumb';
import { PageTitleService } from '../core/page-title/page-title.service';
import { TranslateService} from '@ngx-translate/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import {MediaChange, ObservableMedia} from "@angular/flex-layout";
import PerfectScrollbar from 'perfect-scrollbar';
import { filter } from 'rxjs/operators';
import {UserService} from "../services/user.service";
import {TicketService} from "../services/ticket.service";
declare var $ : any;

const screenfull = require('screenfull');

@Component({
    selector: 'public-layout',
  	templateUrl:'./public-material.html',
  	styleUrls: ['./public-material.scss'],
    providers: [UserService],
    encapsulation: ViewEncapsulation.None
})
export class PublicComponent implements OnInit, OnDestroy {

    _router: Subscription;
    header: string;
    url: string;
    user: any;
    isAdmin: boolean = false;
    isFullscreen: boolean = false;

    boxed: boolean;
    isMobile: boolean = false;
    public innerWidth: any;

    constructor(
        private pageTitleService: PageTitleService,
        private userService: UserService,
        private router: Router,
        private media: ObservableMedia
    ) {
    }

    ngOnInit() {

        const token = localStorage.getItem('token');
        if( token ) {
            this.userService.getCurrentUser().subscribe((user) => {
                this.user = user;
                if (this.user.roles.find(x => x.slug === 'super_admin') !== undefined)
                    this.isAdmin = true;

                this.setUp();
            });
        } else {
            this.setUp();
        }
    }

    setUp() {
        this.innerWidth = window.innerWidth;
        this.pageTitleService.title.subscribe((val: string) => {
            this.header = val;
        });

        this._router = this.router.events.pipe(
            filter((event: Event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            this.url = event.url;
        });
    }

    ngOnDestroy() {
        this._router.unsubscribe();
    }

    onActivate(e, scrollContainer) {
        scrollContainer.scrollTop = 0;
    }

    logout() {
        localStorage.setItem('token', '');
        this.router.navigate(['/session/loginone']);
    }
}


