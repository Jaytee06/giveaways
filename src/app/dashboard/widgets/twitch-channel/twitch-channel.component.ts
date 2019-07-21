import {Component, OnInit} from '@angular/core';

declare const Twitch: any;

@Component({
	selector: 'twitch-channel-widget',
	templateUrl: './twitch-channel-component.html',
	styleUrls: ['./twitch-channel-component.scss'],
})
export class TwitchChannelComponent implements OnInit {

	constructor() {

	}

	ngOnInit() {

		const embed = new Twitch.Embed("twitch-player", {
			width: Math.round(window.innerWidth*.5),
			height: Math.round(window.innerWidth*.25),
			channel: "vintleytv",
			layout: "video-with-chat",
			autoplay: true
		});

		embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
			const player = embed.getPlayer();
			player.play();
		});

	}
}














