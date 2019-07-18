import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'raffle-tickets-dialog',
  templateUrl: './raffle-tickets-dialog.component.html',
  styleUrls: ['./raffle-tickets-dialog.component.css'],
    providers: []
})
export class RaffleTicketsDialogComponent {

	constructor(public dialogRef: MatDialogRef<RaffleTicketsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
		console.log('xx', this.data);
	}

	maxTickets() {
		this.data.raffleEntry.tickets = this.data.maxTickets;
	}

	enter(){
		this.dialogRef.close(this.data);
	}

	cancel(){
		this.dialogRef.close(false);
	}
}
