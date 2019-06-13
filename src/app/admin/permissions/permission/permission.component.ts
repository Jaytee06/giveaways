import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldTypeEnum, IField, IPermission } from '../../../core/interfaces';
import { PageTitleService } from '../../../core/page-title/page-title.service';
import { PermissionService } from '../../../services/permission.service';

@Component({
	selector: 'app-permission',
	templateUrl: './permission.component.html',
	styleUrls: ['./permission.component.scss'],
	providers: [PermissionService],
})
export class PermissionComponent implements OnInit {

	structure: IField[] = [
		{
			name: 'Name',
			_id: 'name',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Subject',
			_id: 'subject',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Description',
			_id: 'description',
			type: FieldTypeEnum.Textarea,
		},
	];
	permission: IPermission = {};
	loading = false;

	constructor(
		private service: PermissionService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(
			params => {
				if (params['id'] != 'new') {
					this.loading = true;
					this.service.getById$(params['id']).subscribe(
						data => {
							this.permission = data;
							this.loading = false;
							this.pageTitleService.setTitle(this.permission.name);
						},
					);
				} else {
					this.pageTitleService.setTitle('New Permission');
				}
			},
		);
	}

	save(permission: IPermission) {
		permission = { ...permission, _id: this.permission._id };
		this.service.save$(permission).subscribe(
			data => {
				this.permission = data;
				this.pageTitleService.setTitle(this.permission.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.permission._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}
}
