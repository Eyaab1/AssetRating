import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; 
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { AssetType } from '../../../../shared/enums/AssetType';
import { LicenseType } from '../../../../shared/enums/LicenseType';
import { ProjectType } from '../../../../shared/enums/ProjectType';
import { StatusType } from '../../../../shared/enums/StatusType';
import { Framework } from '../../../../shared/enums/framework';
import { TagAndcategoryService } from '../../../../shared/services/tag-andcategory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-asset-form.component.html',
  styleUrl: './add-asset-form.component.css'
})
export class AddAssetFormComponent implements OnInit {
  assetForm: FormGroup;
  assetTypes = Object.values(AssetType);
  licenseOptions = Object.values(LicenseType);
  statusOptions = Object.values(StatusType);
  projectTypes = Object.values(ProjectType);
  frameworks = Object.values(Framework);
  showRelatedType: boolean = false;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  dragImageOver: boolean = false;
  iconFile: File | null = null;
  iconPreview: string | null = null;
  dragIconOver: boolean = false;
  documentationFile: File | null = null;



  allTags: { id: number, name: string }[] = [];
  allCategories: { id: number, name: string }[] = [];
  customTag: string = '';

  constructor(
    private fb: FormBuilder, 
    private assetService: AssetServiceService,
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
      assetType: [AssetType.Widget, Validators.required],
      projectType: [ProjectType.FRONTEND, Validators.required],
      tags: [[], Validators.required],
      category: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.assetForm.patchValue({
        publisherMail: decoded.sub,
        publisher: `${decoded.firstName ?? 'Anonymous'} ${decoded.lastName ?? ''}`.trim(),
      });
    }

    this.assetForm.get('assetType')?.valueChanges.subscribe(type => {
      this.addSubtypeFields(type);
    });
    this.addSubtypeFields(this.assetForm.get('assetType')?.value);

    this.tagCatgService.getAllTags().subscribe({
      next: (data) => {
        this.allTags = data;
        console.log(data);
      },
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

 addCustomTag() {
  const tagName = this.customTag.trim();
  const currentTags: string[] = this.assetForm.get('tags')?.value || [];

  if (tagName && !currentTags.includes(tagName)) {
    this.tagCatgService.createTag({ name: tagName }).subscribe({
      next: (createdTag) => {
        this.allTags.push(createdTag);
        this.assetForm.patchValue({
          tags: [...currentTags, tagName]
        });
        this.customTag = '';
        Swal.fire({
          title: 'Tag Added',
          text: `"${tagName}" has been created and selected.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          title: 'Failed to Add Tag',
          text: 'Something went wrong. Try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  } else if (currentTags.includes(tagName)) {
    Swal.fire({
      title: 'Already Exists',
      text: 'This tag is already selected.',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    });
  }
}


onDocumentationSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    if (!file.type.includes('pdf')) {
      alert('Only PDF files are allowed.');
      this.documentationFile = null;
      return;
    }
    this.documentationFile = file;
  }
}

  onImageSelect(event: any) {
  const file: File = event.target.files?.[0];
  if (file) this.handleImage(file);
  }


  onImageDrop(event: DragEvent) {
    event.preventDefault();
    this.dragImageOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleImage(file);
  }

  onImageDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragImageOver = true;
  }

  onImageDragLeave(event: DragEvent) {
    this.dragImageOver = false;
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

  onIconDrop(event: DragEvent) {
    event.preventDefault();
    this.dragIconOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleIcon(file);
  }

  onIconDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragIconOver = true;
  }

  onIconDragLeave(event: DragEvent) {
    this.dragIconOver = false;
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
  if (this.assetForm.valid) {
    const formValues = this.assetForm.value;
    const selectedTagNames: string[] = formValues.tags || [];
    const matchedTagIds: number[] = [];
    selectedTagNames.forEach(tagName => {
      const tagObj = this.allTags.find(t => t.name === tagName);
      if (tagObj?.id != null) matchedTagIds.push(tagObj.id);
    });
    let matchedCategoryIds: number[] = [];
    const catObj = this.allCategories.find(c => c.name === formValues.category);
    if (catObj?.id != null) matchedCategoryIds = [catObj.id];
      const payload: any = {
      name: formValues.name,
      label: formValues.label,
      publisher: formValues.publisher,
      publisherMail: formValues.publisherMail,
      publishDate: formValues.publishDate,
      license: formValues.license.toUpperCase(),
      status: formValues.status.toUpperCase(),
      image: null,
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
        payload.icon = formValues.icon;
        payload.framework = formValues.framework;
        if (formValues.assetType === 'Sheet') payload.format = formValues.format;
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
    if (this.documentationFile) formData.append('documentation', this.documentationFile);
    
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

   
    this.assetService.addAsset(formData).subscribe({
      next: () => {
        Swal.fire({
          title: `Asset "${payload.name}" Created!`,
          text: `Type: ${payload.type}`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000
        });

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
        Swal.fire({
          title: '❌ Asset Creation Failed',
          text: err.error?.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'Close'
        });
      }
    });
  } else {
    Swal.fire({
      title: ' Invalid Form',
      text: 'Please fill in all required fields before submitting.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}
  
  
  removeTag(tag: string) {
    const tags = this.assetForm.get('tags')?.value || [];
    this.assetForm.patchValue({ tags: tags.filter((t: string) => t !== tag) });
  }
  
  
}
