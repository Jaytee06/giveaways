import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../../services/base.service';

@Component({
	selector: 'search-text-filter',
	templateUrl: './search-text-filter.component.html',
	styleUrls: ['./search-text-filter.component.css'],
})
export class SearchTextFilterComponent implements OnInit {

	constructor(private baseService: BaseService) {
	}

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);

	@Input() title = 'Search';
	@Input() disabled = false;

	filters: { searchText?: string } = {};

	ngOnInit() {
		// remember the users last change
		if (this.baseService.storedFilters) {
			if (this.baseService.storedFilters.searchText) this.filters.searchText = this.baseService.storedFilters.searchText;
			this.filterChanged.emit(this.filters);
		}
	}
}
