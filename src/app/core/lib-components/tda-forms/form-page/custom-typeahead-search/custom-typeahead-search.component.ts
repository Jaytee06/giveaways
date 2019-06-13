import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of, concat, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../../../../services/user.service';

@Component({
	selector: 'app-custom-typeahead-search',
	templateUrl: './custom-typeahead-search.component.html',
	styleUrls: ['./custom-typeahead-search.component.scss'],
})
export class CustomTypeaheadSearchComponent implements OnInit {

	@Input() advancedSearch: any;
	@Output() change: EventEmitter<any> = new EventEmitter(true);

	advancedSearchType: string;
	searchText: string;
	bindLabel: string;
	items: Observable<any[]>;
	itemsInput = new Subject<string>();
	itemsIsLoading: boolean = false;
	notFoundText: string = 'No items found';

	constructor(
		private userService: UserService,
	){

	}

	ngOnInit() {
		this.setData();
	}

	setData() {
		this.items = concat(
			of([]),
			this.itemsInput.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => this.itemsIsLoading = true),
				switchMap((term) => {
					if (this.advancedSearchType) {
						if (!term || term && term.length < 3) {
							this.notFoundText = 'Enter at least 3 characters';
							this.itemsIsLoading = false;
							// Clear items list for selected
							return of<any[]>([]);
						} else {
							this.notFoundText = 'No items found';
							switch (this.advancedSearchType.toLowerCase()) {
								default:
									console.log(`wrong advancedSearchType: ${this.advancedSearchType}`);
							}
						}
					}
				})
			)
		);
	}

	somethingChanged(items) {
		this.change.emit({
			items,
			searchType: this.advancedSearchType.toLowerCase()
		});
	}

	clear() {
		this.searchText = null;
	}
}
