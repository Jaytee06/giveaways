import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderedProductService} from "../../services/ordered-product.service";

@Component({
  selector: 'app-ordered-products',
  templateUrl: './ordered-products.component.html',
  styleUrls: ['./ordered-products.component.scss'],
    providers: [OrderedProductService]
})
export class OrderedProductsComponent implements OnInit {

	tableData: any = {
		pageSize:100,
	};

	constructor(
		private pageTitleService: PageTitleService,
		private service: OrderedProductService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Products");

		this.tableData.columns = [
			{key: 'product.image', name: ''},
			{key: 'product.name', name: 'Product'},
			{key: 'product.ticketAmount', name: 'Amount'},
			{key: 'ticketAmount', name: 'Redeemed Amount'},
			{key: 'user.fullname', name: 'User'},
			{key: 'status.name', name: 'Status'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['product.image', 'product.name', 'product.ticketAmount', 'ticketAmount', 'user.fullname', 'status.name', 'createdAt'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					x.product.image = '<img class="ml-2" src="'+x.product.image+'" width="30" height="30">';
					x.product.ticketAmount = x.product.ticketAmount.toLocaleString()+' <span class="fa fa-ticket text-success"></span>';
					x.ticketAmount = x.ticketAmount.toLocaleString()+' <span class="fa fa-ticket text-success"></span>';
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});
				this.tableData.dataSource.emit(data);
			}
		);

	}

	orderedProductSelected(orderedProduct) {
		this.router.navigate([orderedProduct._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
