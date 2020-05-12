import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'object-summation',
	templateUrl: './object-summation.component.html',
	styleUrls: ['./object-summation.component.scss'],
	providers: [],
})
export class ObjectSummationComponent implements OnInit, OnChanges {

	constructor() {
	}

	@Input() structure: any;
	@Output() clicked: EventEmitter<any> = new EventEmitter<any>();
	colsCount = 0;
	rowHeight = '75px';

	ngOnInit() {
		this.setLayout();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.setLayout();
	}

	setLayout() {
		if (this.structure.total && this.structure.total.name) {
			this.colsCount = 1;
			if( this.structure.total.name.length >= 20 ) {
				if( !this.structure.total.textClass ) this.structure.total.textClass = '';
				this.structure.total.textClass += ' font-xs';
			}
		}
		if (this.structure.rowHeight) {
			this.rowHeight = this.structure.rowHeight;
		} else {
			// try to calculate the height
			let largest = 75;
			this.structure.subSummations.forEach(x => {
				let size = 75;
				if (x.subStats && x.subStats.length)
					size += x.subStats.length * 11;

				if (size > largest)
					largest = size;

				if( x.name && x.name.length >= 20 ) {
					if( !x.textClass ) x.textClass = '';
					x.textClass += ' font-xs';
				}
			});
			this.rowHeight = largest + 'px';
		}

		if (!this.structure.maxCols) this.structure.maxCols = 15;
		if (this.structure.subSummations.length > this.structure.maxCols) {
			let size= this.structure.subSummations.length;
			let div = 2;
			if (this.structure.subSummations.length > this.structure.maxCols*2) {
				div = 3;
			}

			if (size % div == 0) {
				this.structure.total.colSpan = div;
				size++;
			}

			size = Math.ceil(size / div);
			this.structure.limitCols = size;
		}
	}

	totalClicked() {
		this.clicked.emit(null);
	}

	statusClicked(statusId, groupId?) {
		this.clicked.emit({ status: statusId, group: groupId || '' });
	}

	subStatusClicked(statusId, subKey, ev) {
		this.clicked.emit({ status: statusId, subStatus: subKey });
		ev.preventDefault();
		ev.stopPropagation();
	}
}
