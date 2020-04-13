import {Component, ViewEncapsulation} from '@angular/core';
import { TranslateService} from '@ngx-translate/core';

@Component({
  	selector: 'chankya-app',
  	template:`<router-outlet>
		
	</router-outlet>
	<div class="footer p-5">
		<div class="d-flex flex-fill justify-content-around">
			<div></div>
			<div>
				<h2>Vintley</h2>
				<hr>
				<div><a [routerLink]="'/help/how-it-works'">How it works</a></div>
				<div><a [routerLink]="'/help/link-to-prime'">Link to Prime</a></div>
				<div><a [routerLink]="'/help/how-to-subscribe'">How to Subscribe</a></div>
			</div>
			<div>
				<h2>Earn</h2>
				<hr>
				<div><a [routerLink]="'/games/list'">Games</a></div>
			</div>
			<div>
				<h2>Rewards</h2>
				<hr>
				<div><a [routerLink]="'/my-giveaways/list'">Giveaways</a></div>
				<div><a [routerLink]="'/'">Amazon Gift Cards</a></div>
			</div>
			<div>
				<h2>Information</h2>
				<hr>
				<div><a [routerLink]="'/blig/list/'">Blog</a></div>
			</div>
			<div></div>
		</div>
	</div>
	`,
    encapsulation: ViewEncapsulation.None
})
export class ChankyaAppComponent {
	constructor(
		translate: TranslateService,
	) {
		translate.addLangs(['en', 'fr']);
		translate.setDefaultLang('en');

		const browserLang: string = translate.getBrowserLang();
		translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
	}
}
