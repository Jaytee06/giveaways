import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, of} from 'rxjs';
import {FieldTypeEnum, IField} from '../../../core/interfaces';
import {PageTitleService} from '../../../core/page-title/page-title.service';
import {PostService} from "../../../services/post.service";
import {CategoryService} from "../../../services/category.service";

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss'],
	providers: [PostService, CategoryService],
})
export class PostComponent implements OnInit {

	constructor(
		private service: PostService,
		private categoryService: CategoryService,
		private pageTitleService: PageTitleService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
	}

	structure: IField[] = [
		{
			name: 'Title',
			_id: 'title',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Description',
			_id: 'description',
			type: FieldTypeEnum.Input,
			required: true,
		},
		{
			name: 'Image',
			_id: 'imageUrl',
			type: FieldTypeEnum.Input,
		},
		{
			name: 'Content',
			_id: 'content',
			type: FieldTypeEnum.WYSIWYG,
		},

		{
			name: 'Categories',
			_id: 'categories',
			type: FieldTypeEnum.ngSelect,
			ngSelectBindLabel: 'name',
			options: [],
			ngEditable: true,
			ngPopUpService: this.categoryService,
			ngPopUpStructure: [
				{name: 'Name', _id:'name', type: FieldTypeEnum.Input, required: true},
				{name: 'Description', _id:'description', type: FieldTypeEnum.Input},
				{name: 'Image', _id:'imageUrl', type: FieldTypeEnum.Input},
			],
			ngPopUpTitle: 'Add New Category',
		},
	];
	values: any = { };
	loading = false;

	ngOnInit() {

		this.loading = true;
		const { activatedRoute: { snapshot: { params: { id } } } } = this;
		const values$ = id !== 'new' ? this.service.getById$(id) : of(this.values);
		const categories$ = this.categoryService.get$();
		combineLatest([values$, categories$]).subscribe((data) => {
			let categories;
			[this.values, categories] = data;

			this.structure.find((x)=> x._id == 'categories').options = categories;
			this.pageTitleService.setTitle(this.values.name ? this.values.name : 'New Post');
			this.loading = false;
		});
	}

	save(values) {
		values = { ...values, _id: this.values._id };
		console.log(values);
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
