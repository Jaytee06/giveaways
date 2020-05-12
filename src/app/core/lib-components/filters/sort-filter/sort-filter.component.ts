import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../../services/base.service';

@Component({
	selector: 'sort-filter',
	templateUrl: './sort-filter.component.html',
	styleUrls: ['./sort-filter.component.css'],
	providers: [],
})
export class SortFilterComponent implements OnInit {

	constructor(private baseService: BaseService) {
	}

	@Input() title = 'Sort By';
	@Input() filterSettings;
	@Input() customNames: {} = {};
	@Input() resetMoreFilters$: EventEmitter<any>;

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);

	filters: any = {};
	items = [];

	ngOnInit() {
		if (this.filterSettings.options) {
			[['createdAt', 'Created']].forEach(sortOption => this.addItem(sortOption));
		}

		// remember the users last change
		//if (this.baseService.storedFilters) {
			//if (!this.filters.sortBy) this.filters.sortBy = '-createdAt';
			//if (this.baseService.storedFilters.sortBy) this.filters.sortBy = this.baseService.storedFilters.sortBy;

			this.filters.sortBy = this.baseService.storedFilters && this.baseService.storedFilters.sortBy || this.filters.sortBy || this.filterSettings.defaultSort || '-createdAt';
			this.filterChanged.emit(this.filters);
		//}

		this.resetMoreFilters$.subscribe(() => {
			this.clear();
		});
	}

	addItem([id, text]: string[]) {
		if (this.customNames && this.customNames[id]) {
			text = this.customNames[id];
		}

		if (this.filterSettings.options.indexOf(id) > -1) {
			this.items.push({ id: '-' + id, label: text + ' - Most Recent' }, { id, label: text + ' - Oldest' });
		}
	}

	clear() {
		this.filters.sortBy = this.filterSettings.defaultSort || '-createdAt';
	}
}
