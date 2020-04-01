import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IField } from '../../../../../interfaces';


interface IPopUpDialogData {
	value: any;
	structure: IField[];
	headerText?: string;
	deleteIsForbidden?: boolean;
}

@Component({
	selector: 'app-pop-up',
	templateUrl: './pop-up.component.html',
	styleUrls: ['./pop-up.component.css'],
	providers: [],
})
export class PopUpComponent {

	constructor(
		public dialogRef: MatDialogRef<PopUpComponent>,
		@Inject(MAT_DIALOG_DATA) public data: IPopUpDialogData,
	) {
		console.log(data);
	}

	save(data: any) {
		this.dialogRef.close({ action_type: 'save', payload: data });
	}

	delete() {
		this.dialogRef.close({ action_type: 'delete' });
	}

	// cancel = () => this.dialogRef.close(); // that line is a same as bind(this)
	cancel() {
		this.dialogRef.close({ action_type: 'close' });
	}

}
