import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'tcg-confirm-dialog',
  templateUrl: './tcg-confirm-dialog.component.html',
  styleUrls: ['./tcg-confirm-dialog.component.css'],
    providers: []
})
export class TcgConfirmDialogComponent {


	constructor(public dialogRef: MatDialogRef<TcgConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any){}

	cancel(){
		this.dialogRef.close();
	}
}
