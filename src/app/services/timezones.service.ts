import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';

const timezones = [
	{ name: 'PDT', offset: -420, tz: 'America/Los_Angeles' }, // UTC -7
	{ name: 'MDT', offset: -360, tz: 'America/Denver' }, // UTC -6
	{ name: 'UTC', offset: 0 },
	{ name: 'MSK', offset: 180, tz: 'Europe/Moscow' }, // UTC +3
];

@Injectable({
	providedIn: 'root',
})
export class TimezonesService {

	constructor() {
	}

	// This function changes the passed time by reference
	static applyTimezoneOffset(time: moment.Moment, timeZone: string | number = 'America/Denver') {
		return time.clone().utc().tz(timeZone); // this will take into account daylight savings
	}

	// For the dateRange filter we provide an array [start, end], while the rest might better use an object
	// TODO consider changing return value to an object
	static getRelativeDateRange(period: String): Moment[] {
		const momentNow = TimezonesService.applyTimezoneOffset(moment());

		// Be careful with removing clone() - it affects results even for simple startOf, endOf
		switch (period) {
			case 'yesterday':
				return [
					momentNow.clone().subtract(1, 'days').startOf('day'),
					momentNow.clone().subtract(1, 'days').endOf('day'),
				];
			case 'sameDayLastWeek':
				return [
					momentNow.clone().subtract(1, 'week').startOf('day'),
					momentNow.clone().subtract(1, 'week').endOf('day'),
				];
			case 'thisWeek':
				return [
					momentNow.clone().startOf('week'),
					momentNow.clone().endOf('week'),
				];
			case 'lastWeek':
				return [
					momentNow.clone().subtract(1, 'week').startOf('week'),
					momentNow.clone().subtract(1, 'week').endOf('week'),
				];
			case 'last7Days':
				return [
					momentNow.clone().subtract(6, 'days').startOf('day'),
					momentNow.clone().endOf('day'),
				];
			case 'sameWeekLastMonth':
				return [
					momentNow.clone().subtract(1, 'month').startOf('week'),
					momentNow.clone().subtract(1, 'month').endOf('week'),
				];
			case 'thisMonth':
				return [
					momentNow.clone().startOf('month'),
					momentNow.clone().endOf('month'),
				];
			case 'lastMonth':
				return [
					momentNow.clone().subtract(1, 'month').startOf('month'),
					momentNow.clone().subtract(1, 'month').endOf('month'),
				];
			case 'lastHalfAYear':
				return [
					momentNow.clone().subtract(6, 'month').startOf('month'),
					momentNow.clone().endOf('month'),
				];
			case 'thisYear':
				return [
					momentNow.clone().startOf('year'),
					momentNow.clone().endOf('year'),
				];
			case 'lastYear':
				return [
					momentNow.clone().subtract(1, 'year').startOf('year'),
					momentNow.clone().subtract(1, 'year').endOf('year'),
				];
			case 'allTime':
				return [
					moment('01-01-2017').startOf('year'),
					momentNow.clone().endOf('day'),
				];
			default:
				return [
					momentNow.clone().startOf('day'),
					momentNow.clone().endOf('day'),
				];
		}
	}

	static dateStringToTz(dateString: string, timeZone: string | number = 'America/Denver') {
		return moment.tz(dateString, timeZone);
	}

	getTimezones = () => timezones;
}
