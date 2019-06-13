import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PageEvent } from '@angular/material/typings/esm5/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import * as _$ from 'jquery';

import { throttle } from 'lodash';

const $ = _$; // Had to do some voodoo to get around ng build

@Component({
	selector: 'tcg-table',
	templateUrl: './tcg-table.component.html',
	styleUrls: ['./tcg-table.component.scss'],
})
export class TcgTableComponent implements OnInit {

	@Input() canEdit;
	@Input() actions;
	@Input() totalItems;
	@Input() dataForUpdateInTable;
	@Input() resetSkip$: EventEmitter<any> = new EventEmitter(true);
	@Input() advancedSearch: any;
	@Input() tableSettings: any;
	@Input() entity: string;

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);
	@Output() rowClicked: EventEmitter<any> = new EventEmitter();
	@Output() selectionChange: EventEmitter<any> = new EventEmitter();
	@Output() updateSale$: EventEmitter<any> = new EventEmitter();

	@HostListener('window:scroll') windowScroll: Function;

	filters: any = {};
	searchBy = '';
	columns: any[] = [
		{ key: 'select', 'name': 'select' },
		{ key: 'name', 'name': 'Name' },
		{ key: 'id', 'name': 'ID' },
	];
	displayedColumns: string[] = ['select', 'name', 'id'];
	pageSizes = [10, 25, 50, 100];
	dataSource: MatTableDataSource<any>;
	selection = new SelectionModel<any>(true, []);
	pageSize = 10;
	pageIndex = 0;
	canAdvanceSearch = false;
	isAdvanceSearch = false;
	advanceSearch: any = {};
	// lastAdvancedSearchType: string;
	advanceSearchLogic = 'AND';
	actionValue;
	window: Element;
	infiniteScroll = false;
	scrollTop = 0;
	scrollDelay = 0;
	scrollOffset = 100; // pixels above the bottom of the screen before the table loads more.
	hasMore = true;
	scrollMultiplier = 1;
	isLoading = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('loadingDiv') loadingDiv: ElementRef;
	private originalData: any[] = [];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.window = document.documentElement as Element;
	}

	ngOnInit() {

		this.resetSkip$.subscribe(() => {
			this.paginator.firstPage();
		});

		if (this.tableSettings.columns) {
			this.columns = this.tableSettings.columns;
		}
		if (this.tableSettings.displayedColumns) {
			this.displayedColumns = this.tableSettings.displayedColumns;
		}
		if (this.tableSettings.pageSizes) {
			this.pageSizes = this.tableSettings.pageSizes;
		}
		if (this.tableSettings.pageSize) {
			this.pageSize = this.tableSettings.pageSize;
		}
		if (this.tableSettings.canAdvanceSearch) {
			this.canAdvanceSearch = this.tableSettings.canAdvanceSearch;
		}
		if (this.tableSettings.infiniteScroll) {
			this.infiniteScroll = this.tableSettings.infiniteScroll;
		}
		if (this.tableSettings.defaultPageSize) {
			this.pageSize = this.tableSettings.defaultPageSize;
		}
		if (this.tableSettings.actions) {
			this.actions = this.tableSettings.actions;
		}

		this.isLoading = true;
		this.tableSettings.dataSource.subscribe((dataSource) => {
			this.originalData = dataSource;
			this.setUpTable();
			if (!this.tableSettings.ajaxPagination) {
				setTimeout(() => this.dataSource.paginator = this.paginator);
			}
			this.tableSettings.isLoading = false;
		});

		this.windowScroll = throttle(() => {
			this.handleScroll();
		}, this.scrollDelay);
	}

	forwardChangeCustomSearch(data) {
		if (data.items && data.items.length) {
			switch (data.searchType) {
				case 'agent':
					this.filters.user = data.items.map((i) => i._id);
					break;
				case 'patient':
					this.filters.patient = data.items.map((i) => i._id);
					break;
				default:
					return;

			}
		} else {
			// TODO: Quick test (if we will be have same filters in header and custom search)
			// TODO: make better implementation (save old value and delete filter by him)
			this.filters.user = this.filters.patient = null;
		}

		this.filterChanged.emit(this.filters);
	}

	getNext(event: PageEvent) {
		const offset = event.pageSize * event.pageIndex;
		console.log('offset', offset);

		this.filters = {
			skip: offset,
			limit: event.pageSize,
		};
		this.filterChanged.emit(this.filters);
	}

	setUpTable() {
		if (!this.infiniteScroll) {
			this.setUpTableData(this.originalData);
		} else {
			this.scrollMultiplier = 0;
			if (this.pageSize > this.originalData.length) {
				this.hasMore = false;
				this.setUpTableData(this.originalData);
			} else {
				const data = this.originalData.slice(0, this.pageSize);
				this.setUpTableData(data);
			}
		}
	}

	setUpTableData(dataSource) {
		this.dataSource = new MatTableDataSource<any>(dataSource);
		// if (this.paginator) this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		// if (this.paginator) this.dataSource.paginator._changePageSize(this.pageSize);

		// Over write angular's filter. We only want to filter displayed columns. Not all columns.
		this.dataSource.filterPredicate = (data, filter) => {
			if (this.isAdvanceSearch) {
				const matchFilter = [];
				const advancedFilter = JSON.parse(filter);

				for (const key in advancedFilter) {
					if (advancedFilter.hasOwnProperty(key)) {
						const val = data[key] === null ? '' : data[key];
						matchFilter.push((val + '').toLowerCase().includes((advancedFilter[key] + '').toLowerCase())); // make sure the column value
						// is a string
					}
				}

				if (this.advanceSearchLogic == 'AND') {
					return matchFilter.every(Boolean); // use for AND conditions
				} else {
					return matchFilter.some(Boolean); // use for OR conditions
				}
			} else {
				let found = false;
				this.displayedColumns.forEach(function (col) {
					if (data[col] && (data[col] + '').trim().toLocaleLowerCase().indexOf(filter) !== -1) { // make sure the column value is a string
						found = true;
						return false; // break out of loop
					}
				});
				return found;
			}
		};
	}

	// displayedColumnChange($event) {
	//   this.displayedColumns = $event;
	//   this.applySearch(); // if they are in the middle of searching then update the table.
	//
	//   // this wasn't working right unless its in a timeout
	//   setTimeout(() => {
	//     this.cleanUpHeader();
	//   }, 0);
	// }

	applySearch() {
		// 	if (this.isAdvanceSearch) {
		// 		this.dataSource.filter = JSON.stringify(this.advanceSearch);
		// 	} else {
		// 		this.dataSource.filter = this.searchBy.trim().toLocaleLowerCase();
		// 	}
		// 	// if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
		//
		// 	if (this.hasMore && this.dataSource.filter != '') {
		// 		this.handleScroll(); // check to see if we need to load more data after it is filtered
		// 	}
	}

	toggleAdvanceSearch() {
		this.isAdvanceSearch = !this.isAdvanceSearch;
		this.searchBy = '';
		this.advanceSearch = {};
		this.dataSource.filter = this.searchBy.trim().toLocaleLowerCase(); // reset the table to original data

		this.cleanUpHeader();
		// reset to the original page so the table will load fast
		this.setUpTable();
	}

	// toggleAdvanceSearchLogic($event) {
	//   if (this.advanceSearchLogic == 'AND') {
	//     this.advanceSearchLogic = 'OR';
	//   } else {
	//     this.advanceSearchLogic = 'AND';
	//   }
	//   $event.stopPropagation();
	// }

	handleScroll() {
		if (this.infiniteScroll) {
			const clientHeight = Math.floor(this.window.clientHeight / this.scrollOffset) * this.scrollOffset;
			const bottomOfTable = Math.floor((this.window.scrollHeight - this.window.scrollTop) / this.scrollOffset) * this.scrollOffset;
			// check if we are scrolling down and we reached the offset from the bottom of the window
			if (this.hasMore && (clientHeight >= bottomOfTable) || (this.loadingDiv && this.loadingDiv.nativeElement.offsetTop < clientHeight)) { // make sure the loadingDib is visible
				this.isLoading = true;
				let end = this.scrollMultiplier * this.pageSize;
				if (end >= this.originalData.length) {
					end = this.originalData.length;
				}
				const data = this.originalData.slice(0, end);
				if (this.scrollMultiplier * this.pageSize >= this.originalData.length) {
					this.hasMore = false;
				}
				this.scrollMultiplier++;
				this.setUpTableData(data);
				this.applySearch(); // TODO:: fix circular dependency
			}

			if (!this.hasMore) {
				this.isLoading = false;
			}
			this.scrollTop = this.window.scrollTop;
		}
	}

	cleanUpHeader() {
		if (this.isAdvanceSearch) {
			$('.mat-sort-header-arrow').hide();
		} else {
			$('.mat-sort-header-arrow').show();
		}
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
		this.selectionChange.emit(this.selection.selected);
	}

	rowToggle(ev, row) {
		if (ev) {
			this.selection.toggle(row);
		}
		this.selectionChange.emit(this.selection.selected);
	}

	getCellValueByKey(row, key) {
		const keySegments = key.split('.');
		if (keySegments.length === 2) {
			if (!row[keySegments[0]] || !row[keySegments[0]][keySegments[1]]) {
				return '';
			}
			return row[keySegments[0]][keySegments[1]];
		} else {
			if (!row[keySegments[0]]) {
				return '';
			}
			return row[keySegments[0]];
		}
	}

	addEntity() {
		this.router.navigate(['new'], { relativeTo: this.activatedRoute }).then();
	}

	actionChange(e) {
		if (e && e.length && !e.includes('Select')) {
			this.actions.find((a) => a.value === e).handler(this.selection.selected).then(() => {
				// Clear selected action and selection rows
				this.selection.clear();
				this.actionValue = undefined;
			});
		}
	}

	updateSale($event, sale, type) {
		console.log($event, sale, type);
		this.updateSale$.emit({
			newValue: $event,
			sale,
			type,
		});
	}

	changeForEdit(row, type: string) {
		if (this.canEdit) row[type] = true;
	}
}
