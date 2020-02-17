import {Component, ElementRef, Inject, Input, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from "@angular/common";

declare const famobi_embedFrame: any;

@Component({
	selector: 'famobi-game',
	templateUrl: './famobi-game-component.html',
	styleUrls: ['./famobi-game-component.scss'],
})
export class FamobiGameComponent implements OnInit {

	@Input() game: any = {};
	@Input() user:any = {};
	windowWidth = window.innerWidth;

	width = 500;
	height = 500;

	constructor(
		private renderer: Renderer2,
		private el: ElementRef,
		@Inject (DOCUMENT) private document,
	) {}

	ngOnInit() {
		this.width = Math.min(this.windowWidth*.8, 640);
		this.height = this.width * this.game.aspectRatio;

		const url = `https://play.famobi.com/${this.game.externalGameTag}/A-GNQH6`;

		const fgJS = this.renderer.createElement('script');
		fgJS.src = 'https://games.cdn.famobi.com/html5games/plugins/embed.js?v=2.1';
		fgJS.onload = () => {
			const fg_frame = this.document.getElementById('famobi-game');
			famobi_embedFrame(fg_frame, url, false, false);
		};
		const firstJS = this.document.getElementsByTagName('script')[0];
		firstJS.parentNode.insertBefore(fgJS, firstJS);

		// const prop = {'agent': 'pub-16845-16872', 'bgcolor':'#fff', 'wrapperwidth':maxWidth+'px', 'wrapperheight':maxWidth+'px', 'gamewidth':'100%', 'gameheight':'100%', 'game_fullscreen_on_mobile':'true', 'locale':'en'};
		// const s = this.renderer.createElement('script');
		// s.type = 'text/javascript';
		// s.src = '//dop3jnx8my3ym.cloudfront.net/embedder.js';
		// s.id = this.game._id;
		// s.onload = () => {
		// 	// embed(this.document, this.game.externalId, this.game.externalGameTag, prop);
		// 	embed(this.document, this.game._id, this.game.externalGameTag, prop);
		// };
		// s.text = ``;
		// this.renderer.appendChild(this.el.nativeElement, s);


			// <script>(function(d, url, fgJS, firstJS){
			// 	fgJS = d.createElement('script');
			// 	firstJS=d.getElementsByTagName('script')[0];
			// 	fgJS.src=url;
			// 	fgJS.onload=function() {
			// 		var fg_frame=document.getElementById('fg-frame-smarty-bubbles');
			// 		var fg_url='https://play.famobi.com/smarty-bubbles/A-GNQH6';
			// 		var mobileRedirect=false;
			// 		var mobileTablet=false;
			// 		famobi_embedFrame(fg_frame, fg_url, mobileRedirect, mobileTablet);
			// 	};
			// 	firstJS.parentNode.insertBefore(fgJS, firstJS);
			// })(document, 'https://games.cdn.famobi.com/html5games/plugins/embed.js?v=2.1')</script>
	}
}














