import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {combineLatest} from "rxjs";
import {UserService} from "../../../services/user.service";
import {MatDialog} from "@angular/material";
import {RedeemProductDialogComponent} from "../../dialogs/redeem-product/redeem-product-dialog.component";
import {TicketService} from "../../../services/ticket.service";

@Component({
  selector: 'widget-products',
  templateUrl: './products-widget.component.html',
  styleUrls: ['./products-widget.component.scss'],
  providers: [ProductService]
})
export class ProductsWidgetComponent implements OnInit {

	products: any[] = [];
	user: any;
	maxTickets = 0;

	cols = 6;
	gutter = 3;

	constructor(
		private service: ProductService,
		private userService: UserService,
		private ticketService: TicketService,
		private dialog: MatDialog,
	) {
	}

	ngOnInit() {
		this.service.filters.active = true;
		this.service.filters.limit = 25;

		const products$ = this.service.get$();
		const user$ = this.userService.getCurrentUser();

		combineLatest(products$, user$).subscribe((data) => {
			[this.products, this.user] = data;

			this.ticketService.myTickets(this.user._id).subscribe((d:any) => {
				if (d)
					this.maxTickets = d.count;
			});

			this.products.map(x => {
				if (this.user.isSubscribed)
					x.discountAmount = Math.max(x.discountAmount, 30);
					x.discountTicketAmount = x.discountAmount ? x.ticketAmount - (x.ticketAmount*(x.discountAmount/100)) : x.ticketAmount;
				return x;
			});
		});

		if( window.innerWidth < 500 ) {
			this.cols = 1;
		} else if( window.innerWidth < 700 ) {
			this.cols = 2;
		} else if( window.innerWidth < 1100 ) {
			this.cols = 3;
		} else if( window.innerWidth < 1300 ) {
			this.cols = 4;
		} else if( window.innerWidth < 1700 ) {
			this.cols = 5;
		}
	}

	addToCart(product) {
		const dialogRef = this.dialog.open(RedeemProductDialogComponent, {data: {product: product, user: this.user}});
		dialogRef.afterClosed().subscribe((result) => {
			if (result !== false) {

			}
		});
	}
}
