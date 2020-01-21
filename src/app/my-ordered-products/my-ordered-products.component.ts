import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import {OrderedProductService} from "../services/ordered-product.service";

@Component({
	selector: 'my-ordered-products',
	templateUrl: './my-ordered-products-component.html',
	styleUrls: ['./my-ordered-products-component.scss'],
})
export class MyOrderedProductsComponent implements OnInit {

	orderedProducts:any[] = [];
	user:any = {};
	querySkip = 0;
	queryLimit = 10;
	windowWidth = window.innerWidth;

	constructor(
		private service: OrderedProductService,
		private userService: UserService,
	) {}

	ngOnInit() {

		const user$ = this.userService.getCurrentUser();
		combineLatest(user$).subscribe((data) => {
			[this.user] = data;
			this.getOrderedProducts();
		});
	}

	getMoreOrderedProducts() {
		this.querySkip += this.queryLimit;
		this.getOrderedProducts();
	}

	getOrderedProducts() {
		this.service.filters.user = this.user._id;
		this.service.filters.skip = this.querySkip;
		this.service.filters.limit = this.queryLimit;
		this.service.get$().subscribe((d:any[]) => {
			d = d.map((t) => {
				t.createdAt = this.service.formatDate(t.createdAt, true);
				return t;
			});
			this.orderedProducts = this.orderedProducts.concat(d);
		});
	}
}














