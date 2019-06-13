import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { FieldTypeEnum, IField, IRole, TypeAttributeEnum } from '../../../core/interfaces';
import { PageTitleService } from '../../../core/page-title/page-title.service';
import { PermissionService } from '../../../services/permission.service';
import { RoleService } from '../../../services/role.service';

@Component({
	selector: 'app-role',
	templateUrl: './role.component.html',
	styleUrls: ['./role.component.scss'],
	providers: [RoleService, PermissionService],
})
export class RoleComponent implements OnInit {

	permissions = [];
	saleStatuses = [];
	reports = [];
	imports = [];

	structure: IField[] = [
		{
			name: 'Name',
			_id: 'name',
			type: FieldTypeEnum.Input,
			typeAttribute: TypeAttributeEnum.NameForSlug,
			shouldChange: true,
			required: true,
		},
		{
			name: 'Slug',
			_id: 'slug',
			type: FieldTypeEnum.Input,
			disabled: true,
		},
		{
			name: 'Description',
			_id: 'description',
			type: FieldTypeEnum.Textarea,
		}
	];

	role: IRole = {
		saleStatuses: [],
		reports: [],
		imports: [],
	};
	loading = false;

	permissionCheckboxes = {
		canRead: { checked: false, indeterminate: false },
		canCreate: { checked: false, indeterminate: false },
		canUpdate: { checked: false, indeterminate: false },
		canDelete: { checked: false, indeterminate: false },
	};

	constructor(
		private service: RoleService,
		private permissionService: PermissionService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {
		this.loading = true;

		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const role$ = id !== 'new' ? this.service.getById$(id) : of(this.role);
		const permissions$ = this.permissionService.get$();
		// TODO:: Get All Reports
		// TODO:: Get All Imports  |||   const imports$ = this.importsService.get$();

		combineLatest(role$, permissions$).subscribe((data) => {
			[this.role, this.permissions] = data;
			this.pageTitleService.setTitle(this.role.name ? this.role.name : 'New Role');
			this.structure.find(i => i.name === 'Name').shouldChange = !this.role._id;
			this.loading = false;
			this.populatePermissions();
		});
	}

	populatePermissions() {
		if (this.permissions.length == 0 || !this.role) return;

		if (!this.role.permissions) this.role.permissions = [];
		this.permissions.forEach(permission => {
			permission.rolePermission = this.role.permissions.find(x => x.permission === permission._id);
			if (!permission.rolePermission) {
				permission.rolePermission = {
					permission: permission._id,
					canCreate: false,
					canRead: false,
					canUpdate: false,
					canDelete: false,
				};
			}
		});

		this.changeIndeterminate('canRead');
		this.changeIndeterminate('canCreate');
		this.changeIndeterminate('canUpdate');
		this.changeIndeterminate('canDelete');
	}

	save(role: IRole) {
		role = { ...role, _id: this.role._id, permissions: this.permissionsChanged() };
		this.service.save$(role).subscribe(
			data => {
				this.loading = true;
				this.role = data;
				this.structure.find(i => i.name === 'Slug').shouldChange = !!this.role._id;
				this.loading = false;
				this.pageTitleService.setTitle(this.role.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.role._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}

	permissionsChanged() {
		return  this.permissions.map(x => x.rolePermission);
	}

	checkAll(checked, attr) {
		this.permissions.forEach(permission => {
			permission.rolePermission[attr] = checked;
		});
	}

	changeIndeterminate(attr) {
		const marked = this.permissions.filter(permission => permission.rolePermission[attr] === true).length;
			let checked = !!marked;
			let indeterminate = checked && this.permissions.length > marked;

			console.log(attr, checked, indeterminate);
		this.permissionCheckboxes[attr].indeterminate = indeterminate;
		this.permissionCheckboxes[attr].checked = checked;
	}
}
