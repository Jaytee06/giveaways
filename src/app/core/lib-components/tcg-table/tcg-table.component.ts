import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {SelectionModel} from "@angular/cdk/collections";

import {throttle} from "lodash";
import * as _$ from 'jquery';
const $ = _$; // Had to do some voodoo to get around ng build

@Component({
  selector: 'tcg-table',
  templateUrl: './tcg-table.component.html',
  styleUrls: ['./tcg-table.component.css']
})
export class TcgTableComponent implements OnInit {

  @Input() tableSettings: any;
  @Output() rowClicked: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @HostListener('window:scroll') windowScroll: Function;

  private originalData: any[] = [];

  searchBy = '';

  columns: any[] = [
    {key: 'select', 'name' : 'select'},
    {key: 'name', 'name' : 'Name'},
    {key: 'id', 'name' : 'ID'}
  ];
  displayedColumns: string[] = ['select', 'name', 'id'];
  pageSizes = [25, 50, 100, 500]
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  pageSize = 100;
  canAdvanceSearch = false;
  isAdvanceSearch = false;
  advanceSearch:any = {};
  advanceSearchLogic = 'AND';

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

  constructor() {
    this.window = document.documentElement as Element;
  }

  ngOnInit() {

    if( this.tableSettings.columns ) this.columns = this.tableSettings.columns;
    if( this.tableSettings.displayedColumns ) this.displayedColumns = this.tableSettings.displayedColumns;
    if( this.tableSettings.pageSizes ) this.pageSizes = this.tableSettings.pageSizes;
    if( this.tableSettings.canAdvanceSearch ) this.canAdvanceSearch = this.tableSettings.canAdvanceSearch;
    if( this.tableSettings.infiniteScroll ) this.infiniteScroll = this.tableSettings.infiniteScroll;
    if( this.tableSettings.defaultPageSize ) this.pageSize = this.tableSettings.defaultPageSize;

    this.isLoading = true;
    this.tableSettings.dataSource.subscribe((dataSource) => {
      this.originalData = dataSource;
      this.setUpTable();
    });

    this.windowScroll = throttle(() => {
      this.handleScroll();
    }, this.scrollDelay);
  }

  setUpTable() {
    if( !this.infiniteScroll ) {
      this.setUpTableData(this.originalData);
    } else {
      this.scrollMultiplier = 0;
      if( this.pageSize > this.originalData.length ) {
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
    if( this.paginator ) this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if( this.paginator ) this.dataSource.paginator._changePageSize(this.pageSize);

    // Over write angular's filter. We only want to filter displayed columns. Not all columns.
    this.dataSource.filterPredicate = (data, filter) => {
      if( this.isAdvanceSearch ) {
        const matchFilter = [];
        const advancedFilter = JSON.parse(filter);

        for( const key in advancedFilter ) {
          if( advancedFilter.hasOwnProperty(key) ) {
            const val = data[key] === null ? '' : data[key];
            matchFilter.push((val+'').toLowerCase().includes((advancedFilter[key]+'').toLowerCase())); // make sure the column value is a string
          }
        }

        if( this.advanceSearchLogic == 'AND' ) {
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

  displayedColumnChange($event) {
    this.displayedColumns = $event;
    this.applySearch(); // if they are in the middle of searching then update the table.

    // this wasn't working right unless its in a timeout
    setTimeout(() => {
      this.cleanUpHeader();
    }, 0);
  }

  applySearch() {
    if( this.isAdvanceSearch ) {
      this.dataSource.filter = JSON.stringify(this.advanceSearch);
    } else {
      this.dataSource.filter = this.searchBy.trim().toLocaleLowerCase();
    }
    if( this.dataSource.paginator ) this.dataSource.paginator.firstPage();

    if( this.hasMore && this.dataSource.filter != '' ) {
      this.handleScroll(); // check to see if we need to load more data after it is filtered
    }
  }

  toggleAdvanceSearch() {
    this.isAdvanceSearch = !this.isAdvanceSearch;
    this.searchBy = '';
    this.advanceSearch = {};
    this.dataSource.filter = this.searchBy.trim().toLocaleLowerCase(); // reset the table to original data

    this.cleanUpHeader()
    // reset to the original page so the table will load fast
    this.setUpTable();
  }

  toggleAdvanceSearchLogic($event) {
    if( this.advanceSearchLogic == 'AND' ) {
      this.advanceSearchLogic = 'OR';
    } else {
      this.advanceSearchLogic = 'AND';
    }
    $event.stopPropagation();
  }

  handleScroll() {
    if( this.infiniteScroll ) {
      const clientHeight = Math.floor(this.window.clientHeight / this.scrollOffset) * this.scrollOffset;
      const bottomOfTable = Math.floor((this.window.scrollHeight - this.window.scrollTop) / this.scrollOffset) * this.scrollOffset;
      // check if we are scrolling down and we reached the offset from the bottom of the window
      if( this.hasMore && (clientHeight >= bottomOfTable) || (this.loadingDiv && this.loadingDiv.nativeElement.offsetTop < clientHeight) ) { // make sure the loadingDib is visible
        this.isLoading = true;
        let end = this.scrollMultiplier * this.pageSize;
        if( end >= this.originalData.length ) end = this.originalData.length;
        const data = this.originalData.slice(0, end);
        if( this.scrollMultiplier * this.pageSize >= this.originalData.length ) {
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
    if( this.isAdvanceSearch ) {
      $(".mat-sort-header-arrow").hide();
    } else {
      $(".mat-sort-header-arrow").show();
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
    ev ? this.selection.toggle(row) : null;
    this.selectionChange.emit(this.selection.selected);
  }
}
