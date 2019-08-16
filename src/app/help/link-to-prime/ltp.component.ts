import {Component, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";

@Component({
  selector: 'help-link-to-prime',
  templateUrl: './ltp.component.html',
  styleUrls: ['./ltp.component.css'],
    providers: []
})
export class LtpComponent implements OnInit {

	constructor(private pageTitleService: PageTitleService){}

	ngOnInit() {
		this.pageTitleService.setTitle('How To Link Twitch To Amazon Prime');
	}
}
