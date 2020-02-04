import {Component, OnInit} from '@angular/core';
import {combineLatest, of} from "rxjs";
import {GameService} from "../../services/games.service";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'game',
	templateUrl: './game-component.html',
	styleUrls: ['./game-component.scss'],
})
export class GameComponent implements OnInit {

	game:any = {};
	user:any = {};
	windowWidth = window.innerWidth;

	constructor(
		private service: GameService,
		private userService: UserService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {}

	ngOnInit() {

		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const game$ = id !== 'new' ? this.service.getById$(id) : of(this.game);

		// const user$ = this.userService.getCurrentUser();
		// combineLatest(game$, user$).subscribe((data) => {
		// 	[this.game, this.user] = data;
		combineLatest(game$).subscribe((data) => {
			[this.game] = data;

			console.log('game', this.game);
		});
	}
}














