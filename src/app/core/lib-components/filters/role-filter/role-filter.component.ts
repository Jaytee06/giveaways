import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../../services/base.service';
import { RoleService } from '../../../../services/role.service';

@Component({
	selector: 'role-filter',
	templateUrl: './role-filter.component.html',
	styleUrls: ['./role-filter.component.css'],
	providers: [RoleService],
})
export class RolesFilterComponent implements OnInit {

	constructor(private service: RoleService, private baseService: BaseService) {
	}

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);
	@Input() title = 'Role';
	@Input() disabled = false;
	filters: any = {};
	roles: any = [];

	ngOnInit() {

		this.service.get$().subscribe((data) => {
			this.roles = <Array<any>>data;
		});

		// remember the users last change
		if (this.baseService.storedFilters) {
			if (this.baseService.storedFilters.role) {
				this.filters.role = this.baseService.storedFilters.role;
			} else {
				this.filters.role = null;
			}
			this.filterChanged.emit(this.filters);
		} else {
			this.filters.role = null;
		}
	}
}
