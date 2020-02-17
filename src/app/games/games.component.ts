import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import {GameService} from "../services/games.service";
import {PageTitleService} from "../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'games',
	templateUrl: './games-component.html',
	styleUrls: ['./games-component.scss'],
})
export class GamesComponent implements OnInit {

	games:any[] = [];
	user:any = {};
	querySkip = 0;
	queryLimit = 10;
	windowWidth = window.innerWidth;

	cols = 6;

	constructor(
		private service: GameService,
		private userService: UserService,
		private pageService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit() {
		// this.pageService.setTitle("Games");

		const user$ = this.userService.getCurrentUser();
		combineLatest(user$).subscribe((data) => {
			[this.user] = data;
			this.getGames();
		});

		if( window.innerWidth < 500 ) {
			this.cols = 1;
		} else if( window.innerWidth < 700 ) {
			this.cols = 2;
		} else if( window.innerWidth < 1100 ) {
			this.cols = 4;
		}

		this.queryLimit = 4 * this.cols;
	}

	getMoreGames() {
		this.querySkip += this.queryLimit;
		this.getGames();
	}

	getGames() {
		this.service.filters.active = true;
		this.service.filters.skip = this.querySkip;
		this.service.filters.limit = this.queryLimit;
		this.service.filters.active = true;
		this.service.get$().subscribe((d:any[]) => {
			this.games = this.games.concat(d);
			console.log(this.games);
		});
	}

	goToGame(game) {
		this.router.navigate(['../', game._id, this.user.fullname], {relativeTo:this.activatedRoute});
	}
}














