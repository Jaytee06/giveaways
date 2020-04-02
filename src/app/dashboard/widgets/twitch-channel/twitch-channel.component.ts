import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {filter, take} from "rxjs/operators";
import {VisibilityService} from "../../../services/visibility.service";

declare const Twitch: any;

@Component({
	selector: 'twitch-channel-widget',
	templateUrl: './twitch-channel-component.html',
	styleUrls: ['./twitch-channel-component.scss'],
	providers: [VisibilityService]
})
export class TwitchChannelComponent implements OnInit {

	@ViewChild("twitchDiv") twitchDiv:ElementRef;

	addedTwitch = false;

	constructor(public visibilityService: VisibilityService) {

	}

	ngOnInit() {

		this.visibilityService
			.elementInSight(this.twitchDiv)
			.pipe(filter(visible => visible), take(1))
			.subscribe(async(result) => {
				if( result && !this.addedTwitch ) {
					const embed = new Twitch.Embed("twitch-player", {
						width: '100%',
						height: '100%',
						//width: Math.round(window.innerWidth*.5),
						//height: Math.round(window.innerWidth*.25),
						channel: "vintleytv",
						layout: "video-with-chat",
						autoplay: true
					});

					embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
						const player = embed.getPlayer();
						player.play();
					});

					this.addedTwitch = true;
				}
			});
	}
}














