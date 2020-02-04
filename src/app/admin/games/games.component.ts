import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../services/games.service";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
    providers: [GameService]
})
export class GamesComponent implements OnInit {

	tableData: any = {
		pageSize:100,
	};

	constructor(
		private pageTitleService: PageTitleService,
		private service: GameService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Games");

		this.tableData.columns = [
			{key: 'thumb', name: ''},
			{key: 'name', name: 'Game'},
			{key: 'externalSite', name: 'Site'},
			{key: 'active', name: 'Active'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['thumb', 'name', 'externalSite', 'active', 'createdAt'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					x.thumb = '<img class="ml-2" src="'+x.thumb+'" width="30" height="30">';
					x.active = x.active ? 'Yes' : 'No';
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});
				this.tableData.dataSource.emit(data);
			}
		);

	}

	gameSelected(game) {
		this.router.navigate([game._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
