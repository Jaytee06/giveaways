import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {OrderedProductService} from "../../../services/ordered-product.service";

@Component({
  selector: 'raffle-tickets-dialog',
  templateUrl: './redeem-product-dialog.component.html',
  styleUrls: ['./redeem-product-dialog.component.css'],
    providers: [OrderedProductService]
})
export class RedeemProductDialogComponent {

	orderedProduct:any = {};
	states;

	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<RedeemProductDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private service: OrderedProductService,
		private userService: UserService,
		private _formBuilder: FormBuilder,
	){
		console.log('xx', this.data);

		this.firstFormGroup = this._formBuilder.group({
			chosenDeliveryMethod: ['', Validators.required]
		});
		this.secondFormGroup = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			address: ['', Validators.required],
			address2: [''],
			city: ['', Validators.required],
			state: ['', Validators.required],
			zip: ['', Validators.required],
		});

		if( !this.data.user.address ) this.data.user.address = {shipping:{}};

		this.orderedProduct.product = data.product._id;
		this.orderedProduct.user = data.user._id;
		this.orderedProduct.ticketAmount = data.product.discountTicketAmount;
		this.orderedProduct.status = '5e263e1162439ea9c9c1294f'; // Pending

		this.states = this.userService.getStates();
	}

	redeem(){
		// update user information
		this.userService.updateUser(this.data.user).subscribe(() => {});

		this.service.customMessage = 'You successfully redeemed your tickets!';
		this.service.save$(this.orderedProduct).subscribe((data) => {
			this.dialogRef.close(true);
		});
	}

	cancel(){
		this.dialogRef.close(false);
	}
}
