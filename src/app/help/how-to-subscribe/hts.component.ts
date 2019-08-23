import {Component, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'help-link-to-prime',
  templateUrl: './hts.component.html',
  styleUrls: ['./hts.component.css'],
    providers: []
})
export class HtsComponent implements OnInit {

	safeURL;

	constructor(private pageTitleService: PageTitleService, private _sanitizer: DomSanitizer){}

	ngOnInit() {
		this.pageTitleService.setTitle('How To Subscribe To VintleyTv for FREE!');

		this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://youtube.com/embed/ZqLP04nxiB0?autoplay=1');
	}
}
