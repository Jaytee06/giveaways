import {Component, ElementRef, Inject, Input, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from "@angular/common";

declare const embed: any;

@Component({
	selector: 'sf-game',
	templateUrl: './sf-game-component.html',
	styleUrls: ['./sf-game-component.scss'],
})
export class SfGameComponent implements OnInit {

	@Input() game: any = {};
	@Input() user:any = {};
	windowWidth = window.innerWidth;

	constructor(
		private renderer: Renderer2,
		private el: ElementRef,
		@Inject (DOCUMENT) private document,
	) {}

	ngOnInit() {
		let maxWidth = Math.min(this.windowWidth*.8, 640);
		const prop = {'agent': 'pub-16845-16872', 'bgcolor':'#fff', 'wrapperwidth':maxWidth+'px', 'wrapperheight':maxWidth+'px', 'gamewidth':'100%', 'gameheight':'100%', 'game_fullscreen_on_mobile':'true', 'locale':'en'};
		const s = this.renderer.createElement('script');
		s.type = 'text/javascript';
		s.src = '//dop3jnx8my3ym.cloudfront.net/embedder.js';
		s.id = this.game._id;
		s.onload = () => {
			// embed(this.document, this.game.externalId, this.game.externalGameTag, prop);
			embed(this.document, this.game._id, this.game.externalGameTag, prop);
		};
		s.text = ``;
		this.renderer.appendChild(this.el.nativeElement, s);
	}
}














