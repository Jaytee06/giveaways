import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {combineLatest, of} from "rxjs";
import { Router} from "@angular/router";
import {TicketService} from "../services/ticket.service";
import * as Highcharts from 'highcharts';
import * as moment from 'moment';

@Component({
	selector: 'my-referrals',
	templateUrl: './my-referrals-component.html',
	styleUrls: ['./my-referrals-component.scss'],
	providers:[TicketService]
})
export class MyReferralsComponent implements OnInit {

	ranges = [
		{_id: 'This Month', dates:{startDateTime: moment().startOf('month'), endDateTime: moment().endOf('month')}},
		{_id: 'Last Month', dates:{startDateTime: moment().subtract(1, 'month').startOf('month'), endDateTime: moment().subtract(1, 'month').endOf('month')}},
	];

	highCharts = Highcharts;
	dates = {
		startDateTime: moment().subtract(30, 'days').startOf('day'),
		endDateTime: moment().add(1, 'day').startOf('day'),
	};
	chartOptions: any = {};

	referrerCode:string = '';
	user:any = {};
	loading = true;
	totalEarned = 0;

	constructor(
		private service: UserService,
		private ticketService: TicketService,
		private router: Router,
	) {}

	ngOnInit() {

		const user$ = this.service.getCurrentUser();
		combineLatest(user$).subscribe((data) => {
			[this.user] = data;
			this.initChart();
		});
	}

	addReferrer() {
		this.service.addReferrer(this.user._id, this.referrerCode).subscribe((referrer) => {
			console.log(referrer);
			this.user.referrer = referrer;
		});
	}

	displayData() {

		this.loading = true;

		this.totalEarned = 0;

		this.ticketService.filters.startDateTime = this.dates.startDateTime.format('YYYY-MM-DDTHH:mm:ss.SSS');
		this.ticketService.filters.endDateTime = this.dates.endDateTime.format('YYYY-MM-DDTHH:mm:ss.SSS');
		this.ticketService.filters.refType = 'referral';
		this.ticketService.filters.groupBy = ['ref', 'day'];
		this.ticketService.filters.user = this.user._id;
		this.ticketService.getCounts$().subscribe((tickets:any[]) => {
			let category = [],
				series = [];

			let start = this.dates.startDateTime;
			while( moment(start).isBefore(moment(this.dates.endDateTime)) ) {
				category.push(start.format('YYYY-MM-DD'));
				start = moment(start).add(1, 'day');
			}

			tickets.forEach((t) => {

				if( t.month < 10 )
					t.month = '0'+t.month;
				if( t.day < 10 )
					t.day = '0'+t.day;

				let i = category.indexOf(t.year+"-"+t.month+'-'+t.day);

				let f = series.find(x => x.name === t.ref.fullname);
				if( f ) {
					f.data[i] = t.count;
				} else {
					let d = {name: t.ref.fullname, data:[]};
					for(let j = 0; j < category.length; j++) {
						d.data[j] = 0;
					}
					d.data[i] = t.count;
					series.push(d);
				}
			});

			if( !series.length ) {
				let d = {name: 'No Referrals', data:[]};
				for(let j = 0; j < category.length; j++) {
					d.data[j] = 0;
				}
				series.push(d);
			}

			setTimeout(() => {
				this.chartOptions.series = series;
				this.chartOptions.xAxis.categories = category;
				this.loading = false;
			}, 100);
		});
	}

	initChart() {

		let self = this;

		this.chartOptions = {
			chart: {
				type: 'column',
			},
			title: {
				text: 'Ticket by referral',
			},
			xAxis: {
				categories: [],
				// labels: {
				// 	y: 40
				// }
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Tickets Earned'
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: 'bold',
						color: ( // theme
							Highcharts.defaultOptions.title.style &&
							Highcharts.defaultOptions.title.style.color
						) || 'gray'
					}
				}
			},
			legend: {
				align: 'right',
				x: -30,
				verticalAlign: 'top',
				y: 25,
				floating: true,
				backgroundColor:
					Highcharts.defaultOptions.legend.backgroundColor || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
			},
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true
					}
				}
			},
			series: [],
		};

		this.displayData();
	}
}














