import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RaffleService} from "../../services/raffle.service";

@Component({
  selector: 'app-raffles',
  templateUrl: './raffles.component.html',
  styleUrls: ['./raffles.component.scss'],
    providers: [RaffleService]
})
export class RafflesComponent implements OnInit {

	tableData: any = {};

	constructor(
		private pageTitleService: PageTitleService,
		private service: RaffleService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Raffles");

		this.tableData.columns = [
			{key: 'user.fullname', name: 'Creator'},
			{key: 'giveAwayName', name: 'Name'},
			{key: 'ffStatus.name', name: 'Status'},
			{key: 'start', name: 'Start'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['user.fullname', 'giveAwayName', 'ffStatus.name', 'start', 'createdAt'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					x.start = this.service.formatDate(x.start, true);
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});

				this.tableData.dataSource.emit(data);
			}
		);

	}

	raffelSelected(raffel) {
		this.router.navigate([raffel._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
