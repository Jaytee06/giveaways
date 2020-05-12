import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExportsService } from '../../../../services/exports.service';

@Component({
	selector: 'export-filter',
	templateUrl: './export-filter.component.html',
	styleUrls: ['./export-filter.component.css'],
	providers: [ExportsService],
})
export class ExportFilterComponent implements OnInit {

	constructor(private service: ExportsService) {
	}

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);

	@Input() title = 'Export';
	@Input() filterSettings;
	@Input() resetMoreFilters$: EventEmitter<any>;

	filters: any = {};
	items = [];

	ngOnInit() {
		if (this.filterSettings.options) {
			this.service.filters.mainRef = this.filterSettings.options;
			this.service.get$().subscribe((d) => {
				this.items = d;
			});
		}

		// remember the users last change
		if (this.service.storedFilters) {
			if (this.service.storedFilters.exportItem) this.filters.exportItem = this.service.storedFilters.exportItem;
			this.filterChanged.emit(this.filters);
		}

		this.resetMoreFilters$.subscribe(() => {
			this.clear();
		});
	}

	clear() {
		delete this.filters.exportItem;
	}
}
