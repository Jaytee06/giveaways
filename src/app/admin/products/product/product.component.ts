import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {combineLatest, of} from "rxjs";
import {ProductService} from "../../../services/product.service";

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss'],
	providers: [ProductService],
})
export class ProductComponent implements OnInit {


	product: any = {};
	loading = false;

	structure: IField[] = [
		{
			name: 'Name',
			_id: 'name',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Image',
			_id: 'image',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.URL,
			required: true,
		},
		{
			name: 'Link',
			_id: 'link',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.URL,
			required: true,
		},
		{
			name: 'Ticket Amount',
			_id: 'ticketAmount',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			required: true,
		},
		{
			name: 'Retail Price',
			_id: 'retailPrice',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Currency,
		},
		{
			name: 'Discount Amount',
			_id: 'discountAmount',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
		},
		{
			name: 'Can Deliver Digitally',
			_id: 'canDigitalDeliver',
			type: FieldTypeEnum.SimpleCheckBox,
		},
		{
			name: 'Can Ship',
			_id: 'canShip',
			type: FieldTypeEnum.SimpleCheckBox,
		},
		{
			name: 'Active',
			_id: 'active',
			type: FieldTypeEnum.SimpleCheckBox,
		},
	];

	constructor(
		private service: ProductService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const product$ = id !== 'new' ? this.service.getById$(id) : of(this.product);
		combineLatest(product$).subscribe((data) => {
			[this.product] = data;
			this.pageTitleService.setTitle(this.product._id ? 'Edit Product' : 'New Product');
			this.loading = false;
		});
	}

	save(product) {
		product = { ...product, _id: this.product._id };
		this.service.save$(product).subscribe(
			data => {
				this.product = data;
				this.pageTitleService.setTitle(this.product.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.product._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}
}
