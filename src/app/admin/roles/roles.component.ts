import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
    providers: [RoleService]
})
export class RolesComponent implements OnInit {

	tableData: any = {};

	constructor(
		private pageTitleService: PageTitleService,
		private service: RoleService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.pageTitleService.setTitle("Roles");

		this.tableData.columns = [
			{key: 'select', name: 'select'},
			{key: 'name', name: 'Name'},
			{key: 'companyNames', name: 'Companies'},
			{key: 'createdAt', name: 'Created'},
			{key: '_id', name: 'ID'},
		];
		this.tableData.displayedColumns = ['select', 'name', 'companyNames', 'createdAt', '_id'];

		this.tableData.isLoading = true;
		this.tableData.dataSource = new EventEmitter();
		this.service.get$().subscribe(
			(data: any[]) => {
				data.forEach((d) => {
					d.companyNames = 'All';
					if( d.companies && d.companies.length > 0 ) {
						d.companyNames = '';
						d.companies.forEach((c) => d.companyNames += c.name+"<br>");
					}
				});
				this.tableData.dataSource.emit(data);
			}
		);

	}

	roleSelected(role) {
		this.router.navigate([role._id], {relativeTo:this.activatedRoute}).then();
	}
}
