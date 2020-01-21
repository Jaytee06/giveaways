import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldTypeEnum, IField, TypeAttributeEnum} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {combineLatest, of} from "rxjs";
import {OrderedProductService} from "../../../services/ordered-product.service";
import {StatusService} from "../../../services/status.service";

@Component({
	selector: 'app-ordered-product',
	templateUrl: './ordered-product.component.html',
	styleUrls: ['./ordered-product.component.scss'],
	providers: [OrderedProductService, StatusService],
})
export class OrderedProductComponent implements OnInit {


	orderedProduct: any = {};
	loading = false;

	statuses:any = [];

	structure: IField[] = [
		{
			name: 'Name',
			_id: 'product.name',
			type: FieldTypeEnum.Input,
			disabled: true,
		},{
			name: 'User',
			_id: 'user.fullname',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'Ticket Amount',
			_id: 'product.ticketAmount',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			disabled: true,
		},
		{
			name: 'Redeemed Ticket Amount',
			_id: 'ticketAmount',
			type: FieldTypeEnum.Input,
			typeAttribute:TypeAttributeEnum.Number,
			disabled: true,
		},
		{
			name: 'Delivery Method',
			_id: 'chosenDeliveryMethod',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'User Email',
			_id: 'user.email',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'User Address',
			_id: 'user.address.shipping.address',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'User Address 2',
			_id: 'user.address.shipping.address2',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'User Address City',
			_id: 'user.address.shipping.city',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'User Address State',
			_id: 'user.address.shipping.state',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'User Address Zip',
			_id: 'user.address.shipping.zip',
			type: FieldTypeEnum.Input,
			disabled: true,
		}, {
			name: 'Status',
			_id: 'status',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel:'name',
			options: this.statuses
		},
		{
			name: 'Created At',
			_id: 'createdAt',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
	];

	constructor(
		private service: OrderedProductService,
		private statusService: StatusService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const orderedProduct$ = id !== 'new' ? this.service.getById$(id) : of(this.orderedProduct);

		this.statusService.filters.type = 'Product';
		const statuses$ = this.statusService.get$();

		combineLatest(orderedProduct$, statuses$).subscribe((data) => {
			[this.orderedProduct, this.statuses] = data;
			this.pageTitleService.setTitle(this.orderedProduct._id ? 'Edit Ordered Product' : 'New Ordered Product');

			this.structure.find(x => x._id === 'status').options = this.statuses;

			this.loading = false;
		});
	}

	save(orderedProduct) {
		orderedProduct = { ...orderedProduct, _id: this.orderedProduct._id };
		this.service.save$(orderedProduct).subscribe(
			data => {
				this.orderedProduct = data;
			},
		);
	}

	delete() {
		this.service.delete$(this.orderedProduct._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}
}
