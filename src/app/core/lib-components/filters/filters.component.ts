import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { BaseService } from '../../../services/base.service';

@Component({
	selector: 'filters',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.css'],
	providers: [],
})
export class FiltersComponent implements OnInit, OnChanges {
	constructor(private baseService: BaseService) {
	}

	@Input() filterOptions: any;
	@Input() isTableLoading$: EventEmitter<boolean>;

	@Output() filterChanged$: EventEmitter<any> = new EventEmitter(true);
	@Output() exportObjs$?: EventEmitter<any> = new EventEmitter(true);

	resetMoreFilters$: EventEmitter<any> = new EventEmitter();

	customNames: { [key: string]: string } = {};
	indivDisabledFilters: any = {};
	moreFiltersLength = 0;
	filters: any = {};
	moreFilters: any = {};
	disableFilters: boolean;

	@Input()
	set filterCustomNames(names) {
		if (this.filterOptions.applyCustomNames !== false) {

		}
	}

	trackByFn = (index) => index;

	ngOnInit(): void {
		if (this.isTableLoading$) {
			this._disableFiltersWhileLoading();
		}

		if (this.baseService.storedFilters && !_.isEmpty(this.baseService.storedFilters)) {
			this.filters = _.cloneDeep(this.baseService.storedFilters);
			this.applyMoreFilters();
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		// this._setCustomFiltersDisabled();
	}

	applyFilters(params?) {
		for (let key of Object.keys(this.filters)) {
			if (typeof this.filters[key] === 'undefined') delete this.filters[key];
		}
		this.baseService.storedFilters = this.filters;
		if (params && params.reset) {
			this.filters.reset = true;
		}
		delete this.filters.limit;
		this.filterChanged$.emit({ ...this.filters });
	}

	subFilterChanged(ev) {
		this.filters = { ...this.filters, ...ev, resetSkip: true };
		this.applyFilters();
	}

	moreFilterChanged(ev) {
		this.moreFilters = { ...this.moreFilters, ...ev };
	}

	applyMoreFilters() {
		this.moreFiltersLength = 0;
		Object.keys(this.moreFilters).forEach(key => {
			if (this.moreFilters[key]) this.moreFiltersLength++;
		});
		this.filters = { ...this.filters, ...this.moreFilters };
		this.applyFilters();
	}

	export() {
		if (this.exportObjs$ && this.moreFilters.exportItem)
			this.exportObjs$.emit(this.moreFilters);
	}

	resetMoreFilters() {
		for (let key of Object.keys(this.moreFilters)) {
			delete this.filters[key];
		}

		this.moreFilters = {};
		this.moreFiltersLength = 0;
		this.applyFilters({ reset: true });
		this.resetMoreFilters$.emit(null);
	}

	private _disableFiltersWhileLoading(): void {
		this.isTableLoading$.subscribe((isTableLoading: boolean) => {
			this.disableFilters = isTableLoading;
		});

		this.filterChanged$.subscribe(() => {
			this.disableFilters = true;
		});
	}
}
