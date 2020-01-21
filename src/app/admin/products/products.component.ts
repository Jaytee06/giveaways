import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
    providers: [ProductService]
})
export class ProductsComponent implements OnInit {

	tableData: any = {
		pageSize:100,
	};

	constructor(
		private pageTitleService: PageTitleService,
		private service: ProductService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Products");

		this.tableData.columns = [
			{key: 'image', name: ''},
			{key: 'name', name: 'Product'},
			{key: 'ticketAmount', name: 'Amount'},
			{key: 'retailPrice', name: 'Retail'},
			{key: 'discountAmount', name: 'Discount'},
			{key: 'active', name: 'Active'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['image', 'name', 'ticketAmount', 'retailPrice', 'discountAmount', 'active', 'createdAt'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					x.image = '<img class="ml-2" src="'+x.image+'" width="30" height="30">';
					x.ticketAmount = x.ticketAmount.toLocaleString()+' <span class="fa fa-ticket text-success"></span>';
					x.retailPrice = '$ '+Number(x.retailPrice).toFixed(2);
					if( x.discountAmount ) x.discountAmount = x.discountAmount+' %';
					x.active = x.active ? 'Yes': 'No';
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});
				this.tableData.dataSource.emit(data);
			}
		);

	}

	productSelected(product) {
		this.router.navigate([product._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
