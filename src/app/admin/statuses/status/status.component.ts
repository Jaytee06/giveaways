import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { IField, FieldTypeEnum } from '../../../core/interfaces';
import { PageTitleService } from '../../../core/page-title/page-title.service';
import { PartnerService } from '../../../services/partner.service';
import { RoleService } from '../../../services/role.service';
import {StatusService} from "../../../services/status.service";

@Component({
	selector: 'app-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss'],
	providers: [StatusService, PartnerService, RoleService],
})
export class StatusComponent implements OnInit {

	constructor(
		private service: StatusService,
		private partnerService: PartnerService,
		private roleService: RoleService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	statusTypes = [
		{ _id: 'Raffle' },
	];
	structure: IField[] = [
		{
			name: 'Name',
			_id: 'name',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Sorting',
			_id: 'sort',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Type',
			_id: 'type',
			type: FieldTypeEnum.ngSelect,
			options: this.statusTypes,
			required: true,
			ngSelectBindLabel: '_id',
		},
		{
			name: 'Reasons',
			_id: 'reasons',
			options: [],
			type: FieldTypeEnum.ArrayInput,
		},
		{
			name: 'Active',
			_id: 'active',
			type: FieldTypeEnum.SimpleCheckBox,
		},
	];
	roles;
	values: any = { active: true };
	loading = false;

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const values$ = id !== 'new' ? this.service.getById$(id) : of(this.values);
		const roles$ = this.roleService.get$();
		combineLatest([values$, roles$]).subscribe((data) => {
			[this.values, this.roles] = data;

			this.structure.find(i => i._id === 'reasons').options = this.values.reasons;
			this.pageTitleService.setTitle(this.values.name ? this.values.name : 'New Status');
			this.loading = false;
		});
	}

	save(values) {
		values = { ...values, _id: this.values._id };
		this.service.save$(values).subscribe( data => {
				this.values = data;
				this.pageTitleService.setTitle(this.values.name);
			},
		);
	}

	delete() {
		this.service.delete$(this.values._id).subscribe(() => {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
		});
	}

	cancel() {
		this.router.navigate(['../'], { relativeTo: this.activatedRoute }).then();
	}

}
