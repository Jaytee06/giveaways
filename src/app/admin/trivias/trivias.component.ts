import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TriviaService} from "../../services/trivia.service";

@Component({
  selector: 'app-trivias',
  templateUrl: './trivias.component.html',
  styleUrls: ['./trivias.component.scss'],
    providers: [TriviaService]
})
export class TriviasComponent implements OnInit {

	tableData: any = {};

	constructor(
		private pageTitleService: PageTitleService,
		private service: TriviaService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Trivia Quizzes");

		this.tableData.columns = [
			{key: 'user.fullname', name: 'Creator'},
			{key: 'numOfQuestions', name: 'Questions'},
			{key: 'category', name: 'Category'},
			{key: 'payoutType', name: 'Payout Type'},
			{key: 'start', name: 'Start'},
			{key: 'createdAt', name: 'Created'}
		];
		this.tableData.displayedColumns = ['user.fullname', 'numOfQuestions', 'category', 'payoutType', 'start', 'createdAt'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				data = data.map((x) => {
					x.start = this.service.formatDate(x.start, true);
					x.createdAt = this.service.formatDate(x.createdAt, true);
					return x;
				});
				// console.log(data);
				this.tableData.dataSource.emit(data);
			}
		);

	}

	triviaSelected(trivia) {
		this.router.navigate([trivia._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		// console.log(row);
	}
}
