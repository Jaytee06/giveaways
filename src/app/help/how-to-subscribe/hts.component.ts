import {Component, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";

@Component({
  selector: 'help-link-to-prime',
  templateUrl: './hts.component.html',
  styleUrls: ['./hts.component.css'],
    providers: []
})
export class HtsComponent implements OnInit {

	constructor(private pageTitleService: PageTitleService){}

	ngOnInit() {
		this.pageTitleService.setTitle('How To Subscribe To VintleyTv for FREE!');
	}
}
