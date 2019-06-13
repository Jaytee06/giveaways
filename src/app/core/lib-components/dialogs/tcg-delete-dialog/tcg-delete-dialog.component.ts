import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'tcg-delete-dialog',
  templateUrl: './tcg-delete-dialog.component.html',
  styleUrls: ['./tcg-delete-dialog.component.css'],
    providers: []
})
export class TcgDeleteDialogComponent {


	constructor(public dialogRef: MatDialogRef<TcgDeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any){}

	cancel(){
		this.dialogRef.close();
	}
}
