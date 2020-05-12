import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../../services/base.service';
import { StatusService } from '../../../../services/status.service';

@Component({
	selector: 'statuses-filter',
	templateUrl: './statuses-filter.component.html',
	styleUrls: ['./statuses-filter.component.css'],
	providers: [StatusService],
})
export class StatusesFilterComponent implements OnInit, OnChanges {

	constructor(private statusService: StatusService, private baseService: BaseService) {
	}

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);
	@Input() filterSettings;
	@Input() statusType: string;
	@Input() labelName: string;
	@Input() title = `${this.statusType} status`;
	@Input() key = 'status';
	@Input() disabled = false;
	filters = { };
	statusOptions: any = [];

	ngOnInit() {
		this.title = this.title || `Select ${this.statusType} statuses`;
		this.filters[this.key] = [];

		if (this.filterSettings) {
			if (this.filterSettings.query) this.statusService.filters = this.filterSettings.query;
			if (this.filterSettings.value) this.filters[this.key] = this.filterSettings.value;
		}

		this.statusService.filters.type = this.statusType;
		this.statusService.get$().subscribe((statuses: any[]) => {
			this.statusOptions = statuses;
			this.statusOptions.splice(0, 0, {_id:-1, name:'- No Status -'});
		});

		this.restoreRememberedFilters();
	}

	// TODO make sure that we set value to array where it supports multiplee values, even if it's 1 value
	ngOnChanges(changes: any) {
		if (changes && changes.filterSettings && changes.filterSettings.currentValue) {
			if (changes.filterSettings.currentValue.value) this.filters[this.key] = changes.filterSettings.currentValue.value;
		}
	}

	restoreRememberedFilters() {
		if (this.baseService.storedFilters) {
			if (this.baseService.storedFilters.status) {
				this.filters[this.key] = this.baseService.storedFilters.status;
			}

			this.filterChanged.emit(this.filters);
		}
	}
}

