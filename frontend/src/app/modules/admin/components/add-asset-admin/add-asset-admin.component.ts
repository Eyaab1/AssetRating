import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminAssetService } from '../../../../shared/services/adminServices/admin-asset.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddAssetFormComponent } from '../../../contributor/components/add-asset-form/add-asset-form.component';
import { AssetType } from '../../../../shared/enums/AssetType';
import { LicenseType } from '../../../../shared/enums/LicenseType';
import { StatusType } from '../../../../shared/enums/StatusType';
import { ProjectType } from '../../../../shared/enums/ProjectType';
import { Category } from '../../../../shared/models/category';
import { Framework } from '../../../../shared/enums/framework';
import { Tag } from '../../../../shared/models/tag';
import { jwtDecode } from 'jwt-decode';
import { TagAndcategoryService } from '../../../../shared/services/tag-andcategory.service';
import { Format } from '../../../../shared/enums/Format';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-asset-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-asset-admin.component.html',
  styleUrls: ['./add-asset-admin.component.css']
})
export class AddAssetAdminComponent implements OnInit {
  assetForm: FormGroup;
  assetTypes = Object.values(AssetType);
  licenseOptions = Object.values(LicenseType);
  statusOptions = Object.values(StatusType);
  projectTypes = Object.values(ProjectType);
  frameworks = Object.values(Framework);
  formats = Object.values(Format);

  showRelatedType: boolean = false;

  imageFile: File | null = null;
  imagePreview: string | null = null;
  iconFile: File | null = null;
  iconPreview: string | null = null;
  documentationFile: File | null = null;

  allTags: { id: number, name: string }[] = [];
  allCategories: { id: number, name: string }[] = [];
  customTag: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private assetService: AdminAssetService,
    private tagCatgService: TagAndcategoryService
  ) {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      label: ['', Validators.required],
      publisher: [''],
      publisherMail: ['', [Validators.required, Validators.email]],
      publishDate: [this.getTodayDate(), Validators.required],
      license: [LicenseType.Free, Validators.required],
      status: [StatusType.Published, Validators.required],
      image: [''],
      description: [''],
      documentation: [''],
      assetType: ['', Validators.required],
      projectType: [ProjectType.FRONTEND, Validators.required],
      tags: [[], Validators.required],
      category: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const preselectedType = this.route.snapshot.queryParamMap.get('type');
    console.log(preselectedType)
    if (token) {
      const decoded: any = jwtDecode(token);
      this.assetForm.patchValue({
        publisherMail: decoded.sub,
        publisher: `${decoded.firstName ?? 'Anonymous'} ${decoded.lastName ?? ''}`.trim(),
      });
    }

    if (preselectedType) {
      this.assetForm.patchValue({ assetType: preselectedType });
      this.addSubtypeFields(preselectedType);
    }

    this.assetForm.get('assetType')?.valueChanges.subscribe(type => {
      this.addSubtypeFields(type);
    });

    this.tagCatgService.getAllTags().subscribe({
      next: (data) => this.allTags = data,
      error: (err) => console.error('Tag fetch error:', err)
    });

    this.tagCatgService.getAllCategories().subscribe({
      next: (data) => this.allCategories = data,
      error: (err) => console.error('Category fetch error:', err)
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  toggleTag(tag: string) {
    const currentTags: string[] = this.assetForm.get('tags')?.value || [];
    if (currentTags.includes(tag)) {
      this.assetForm.patchValue({ tags: currentTags.filter(t => t !== tag) });
    } else {
      this.assetForm.patchValue({ tags: [...currentTags, tag] });
    }
  }

  isTagSelected(tag: string): boolean {
    return this.assetForm.get('tags')?.value?.includes(tag);
  }

  addSubtypeFields(type: string) {
    const controls = this.assetForm.controls;
    ['icon', 'framework', 'format', 'themeType', 'primaryColor', 'templateCategory', 'preconfigured', 'dependencies']
      .forEach(field => controls[field] && this.assetForm.removeControl(field));

    switch (type) {
      case 'Widget':
      case 'Sheet':
        this.assetForm.addControl('icon', this.fb.control('', Validators.required));
        this.assetForm.addControl('framework', this.fb.control('', Validators.required));
        if (type === 'Sheet') {
          this.assetForm.addControl('format', this.fb.control('', Validators.required));
        }
        break;
      case 'Theme':
        this.assetForm.addControl('themeType', this.fb.control('', Validators.required));
        this.assetForm.addControl('primaryColor', this.fb.control('', Validators.required));
        this.assetForm.addControl('framework', this.fb.control('', Validators.required));
        break;
      case 'Template':
        this.assetForm.addControl('templateCategory', this.fb.control('', Validators.required));
        this.assetForm.addControl('framework', this.fb.control('', Validators.required));
        break;
      case 'Connector':
        this.assetForm.addControl('preconfigured', this.fb.control(false));
        break;
      case 'Utility':
        this.assetForm.addControl('dependencies', this.fb.control('', Validators.required));
        break;
    }
  }

  onDocumentationSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.documentationFile = input.files[0];
  }

  onImageSelect(event: any) {
    const file: File = event.target.files?.[0];
    if (file) this.handleImage(file);
  }

  handleImage(file: File) {
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.assetForm.patchValue({ image: file.name });
    };
    reader.readAsDataURL(file);
  }

  onIconSelect(event: any) {
    const file: File = event.target.files?.[0];
    if (file) this.handleIcon(file);
  }

  handleIcon(file: File) {
    this.iconFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.iconPreview = reader.result as string;
      this.assetForm.patchValue({ icon: file.name });
    };
    reader.readAsDataURL(file);
  }

  submitAsset() {
    if (!this.assetForm.valid) {
      alert('Please fill in all required fields.');
      return;
    }

    const formValues = this.assetForm.value;
    const matchedTagIds = this.allTags.filter(tag => formValues.tags.includes(tag.name)).map(tag => tag.id);
    const catObj = this.allCategories.find(c => c.name === formValues.category);
    const matchedCategoryIds = catObj ? [catObj.id] : [];

    const payload: any = {
      name: formValues.name,
      label: formValues.label,
      publisher: formValues.publisher,
      publisherMail: formValues.publisherMail,
      publishDate: formValues.publishDate,
      license: formValues.license.toUpperCase(),
      status: formValues.status.toUpperCase(),
      image: this.imageFile ? this.imageFile.name : formValues.image || null,
      documentation: null,
      description: formValues.description || '',
      projectType: formValues.projectType,
      type: formValues.assetType,
      tagIds: matchedTagIds,
      categoryIds: matchedCategoryIds
    };

    switch (formValues.assetType) {
      case 'Widget':
      case 'Sheet':
        payload.icon = this.iconFile ? this.iconFile.name : formValues.icon || null;
        payload.framework = formValues.framework;
        if (formValues.assetType === 'Sheet') {
          payload.format = formValues.format;
        }
        break;
      case 'Theme':
        payload.themeType = formValues.themeType;
        payload.primaryColor = formValues.primaryColor;
        payload.framework = formValues.framework;
        break;
      case 'Template':
        payload.templateCategory = formValues.templateCategory;
        payload.framework = formValues.framework;
        break;
      case 'Connector':
        payload.preconfigured = formValues.preconfigured;
        break;
      case 'Utility':
        payload.dependencies = formValues.dependencies;
        break;
    }

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (this.documentationFile) {
      formData.append('documentation', this.documentationFile);
    }

    this.assetService.addAsset(formData).subscribe({
      next: () => {
        alert(`Asset of type '${payload.type}' created successfully!`);
        this.assetForm.reset({
          license: LicenseType.Free,
          status: StatusType.Published,
          assetType: AssetType.Widget,
          projectType: ProjectType.FRONTEND,
          publishDate: this.getTodayDate()
        });
        this.imageFile = null;
        this.imagePreview = null;
        this.iconFile = null;
        this.iconPreview = null;
        this.documentationFile = null;
        this.addSubtypeFields(AssetType.Widget);
      },
      error: (err) => {
        console.error('Asset creation failed:', err);
        alert('Failed to create asset.');
      }
    });
  }
}