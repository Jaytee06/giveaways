import {Component, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'help-link-to-prime',
  templateUrl: './ltp.component.html',
  styleUrls: ['./ltp.component.css'],
    providers: []
})
export class LtpComponent implements OnInit {

	safeURL;

	constructor(private pageTitleService: PageTitleService, private _sanitizer: DomSanitizer){}

	ngOnInit() {
		this.pageTitleService.setTitle('How To Link Twitch To Amazon Prime');

		this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://youtube.com/embed/LtxWjZ8E0ck?autoplay=1');
	}
}
