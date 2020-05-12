import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment-timezone';
import { Moment } from 'moment-timezone';
import { BaseService } from '../../../../services/base.service';
import { RoleService } from '../../../../services/role.service';
import { TimezonesService } from '../../../../services/timezones.service';
import { UserService } from '../../../../services/user.service';

@Component({
	selector: 'date-range-filter',
	templateUrl: './date-range-filter.component.html',
	styleUrls: ['./date-range-filter.component.scss'],
	providers: [RoleService],
})
export class DateRangeFilterComponent implements OnInit {

	constructor(
		private _baseService: BaseService,
		private _timezonesService: TimezonesService,
		private _userService: UserService,
	) {
	}

	@Input() filterDateRange: any;
	@Input() title = 'Date range';
	@Input() disabled = false;

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);

	ranges: any = {
		['today']: TimezonesService.getRelativeDateRange('today'),
		['yesterday']: TimezonesService.getRelativeDateRange('yesterday'),
		['last7Days']: TimezonesService.getRelativeDateRange('last7Days'),
		['thisMonth']: TimezonesService.getRelativeDateRange('thisMonth'),
		['lastMonth']: TimezonesService.getRelativeDateRange('lastMonth'),
		['thisYear']: TimezonesService.getRelativeDateRange('thisYear'),
		['lastYear']: TimezonesService.getRelativeDateRange('lastYear'),
	};
	timezones = this._timezonesService.getTimezones();

	ngOnInit() {
		this.filterDateRange = this.filterDateRange || <any>{};
		this.filterDateRange.startDate = this.filterDateRange && this.filterDateRange.startDate ? this.filterDateRange.startDate : TimezonesService.getRelativeDateRange('today')[0];
		this.filterDateRange.endDate = this.filterDateRange && this.filterDateRange.endDate ? this.filterDateRange.endDate : TimezonesService.getRelativeDateRange('today')[1];

		// load users last change
		if (this._baseService.storedFilters) {
			if (this._baseService.storedFilters.startDateTime) {
				this.filterDateRange.startDate = TimezonesService.applyTimezoneOffset(moment(this._baseService.storedFilters.startDateTime));
			}

			if (this._baseService.storedFilters.endDateTime) {
				this.filterDateRange.endDate = TimezonesService.applyTimezoneOffset(moment(this._baseService.storedFilters.endDateTime));
			}

			if (this.filterDateRange.startDate || this.filterDateRange.endDate) {
				this.filterDateRange.timeZoneOffset = this._baseService.timeZoneOffset;
			}
		}

		this._userService.getCurrentUser().subscribe((user) => {
			if( !!user.roles.find(x => x.slug === 'super_admin' || x.slug === 'company_admin') ) {
				this._addDateRanges();
			}
		});
	}

	ngModelChange(filter: { startDate: Moment, endDate: Moment } = null) {
		if (filter) {
			this.filterDateRange = this.filterDateRange || <any>{};
			this.filterDateRange.startDate = filter.startDate;
			this.filterDateRange.endDate = filter.endDate;
		}

		// Prepare data to be sent to the main filter
		if (this.filterDateRange.startDate) {
			this.filterChanged.emit({
				// The date is either local (manual date range selection) or already in PST (predefined ranges)
				startDateTime: !filter.startDate.tz() ? TimezonesService.dateStringToTz(filter.startDate.format('YYYY-MM-DD')).utc().format() : TimezonesService.applyTimezoneOffset(this.filterDateRange.startDate).utc().format(),
				endDateTime: !filter.endDate.tz() ? TimezonesService.dateStringToTz(filter.endDate.format('YYYY-MM-DD')).endOf('day').utc().format() : TimezonesService.applyTimezoneOffset(this.filterDateRange.endDate).utc().format(),
			});
		}
	}

	private _addDateRanges() {

		let years = 2;
		let xYearsAgo;
		do {
			xYearsAgo = moment().subtract(years, 'year').format('YYYY');

			this.ranges['Last '+xYearsAgo] = [
				TimezonesService.applyTimezoneOffset(moment()).subtract(years, 'years').startOf('year'),
				TimezonesService.applyTimezoneOffset(moment()).subtract(years, 'years').endOf('year')
			];

			years++;
		} while( Number(xYearsAgo) > 2016 );
	}

	// changeOffset() {
	// 	this.ngModelChange(null);
	// }
}
