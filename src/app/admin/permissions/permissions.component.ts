import {Component, EventEmitter, OnInit} from '@angular/core';
import {PageTitleService} from "../../core/page-title/page-title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PermissionService} from "../../services/permission.service";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
    providers: [PermissionService]
})
export class PermissionsComponent implements OnInit {

	tableData: any = {};

	constructor(
		private pageTitleService: PageTitleService,
		private service: PermissionService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Permissions");

		this.tableData.columns = [
			{key: 'select', name: 'select'},
			{key: 'name', name: 'Name'},
			{key: 'subject', name: 'Subject'},
			{key: 'createdAt', name: 'Created'},
			{key: '_id', name: 'ID'},
		];
		this.tableData.displayedColumns = ['select', 'name', 'subject', 'createdAt', '_id'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				this.tableData.dataSource.emit(data);
			}
		);

	}

	permissionSelected(permission) {
		this.router.navigate([permission._id], {relativeTo:this.activatedRoute});
	}

	rowSelected(row) {
		console.log(row);
	}
}
