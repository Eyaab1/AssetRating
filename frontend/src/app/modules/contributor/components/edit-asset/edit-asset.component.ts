import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssetType } from '../../../../shared/enums/AssetType';
import { Framework } from '../../../../shared/enums/framework';
import { LicenseType } from '../../../../shared/enums/LicenseType';
import { ProjectType } from '../../../../shared/enums/ProjectType';
import { StatusType } from '../../../../shared/enums/StatusType';
import { Asset } from '../../../../shared/models/asset';
import { AssetRelease } from '../../../../shared/models/asset-release';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-asset',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule ],
  templateUrl: './edit-asset.component.html',
  styleUrl: './edit-asset.component.css'
})
export class EditAssetComponent implements OnInit {
  assetForm!: FormGroup;
  assetId!: string;
  private assetSelected!: Asset;
  assetReleases: AssetRelease[] = [];
  licenseOptions = Object.values(LicenseType);
  statusOptions = Object.values(StatusType);
  projectTypes = Object.values(ProjectType);

  activeTab: 'general' | 'releases' = 'general';

  selectedRelease: AssetRelease | null = null;
  showAddRelease = false;
  newReleaseVersion = '';
  newReleaseFile: File | null = null;
  frameworks = Object.values(Framework);
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private assetService: AssetServiceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id')!;
    this.loadAsset();
    this.loadReleases();
  }

  loadAsset(): void {
    this.assetService.getAssetById(this.assetId).subscribe(asset => {
      this.assetSelected = asset;
  
      this.assetForm = this.fb.group({
        name: [asset.name, Validators.required],
        label: [asset.label, Validators.required],
        publisher: [{ value: asset.publisher, disabled: true }],
        publisherMail: [{ value: asset.publisherMail, disabled: true }],
        publishDate: [{ value: asset.publishDate, disabled: true }],
        license: [asset.license, Validators.required],
        status: [asset.status, Validators.required],
        projectType: [asset.projectType, Validators.required],
        description: [asset.description],
        assetType: [asset.type, Validators.required]
      });
  
      this.addSubtypeFields(asset.type, asset);
  
      this.assetForm.get('assetType')?.valueChanges.subscribe(type => {
        this.addSubtypeFields(type);
      });
    });
  }
  getFullAssetUrl(filePath: string): string {
    return `http://localhost:8081${filePath.startsWith('/') ? filePath : '/' + filePath}`;
  }
onIconSelect(event: any): void {
  const file: File = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      // Optional: Show preview
      this.assetForm.patchValue({ icon: file.name }); // You may want to store the file separately for upload
    };
    reader.readAsDataURL(file);
  }
}
getIcon(img?: string): string {
  return img ? `assets/images/${img}` : '';
}
hasSubtypeFields(): boolean {
  return ['icon', 'framework', 'format', 'themeType', 'primaryColor', 'templateCategory', 'preconfigured', 'dependencies']
    .some(field => this.assetForm.get(field));
}


  loadReleases(): void {
    this.assetService.getReleasesByAsset(this.assetId).subscribe(data => {
      this.assetReleases = data;
      console.log('Asset Releases:', data);
    });
  }

  toggleRelease(releaseId: number): void {
    if (this.selectedRelease?.id === releaseId) {
      this.selectedRelease = null;
    } else {
      const match = this.assetReleases.find(r => r.id === releaseId);
      if (match) {
        this.selectedRelease = match;
  
        if (typeof match.releasedAsset === 'string') {
          this.assetService.getAssetById(match.releasedAsset).subscribe({
            next: data => this.selectedRelease!.releasedAsset = data,
            error: err => console.error('Failed to fetch released asset:', err)
          });
        }
      }
    }
  }
  
  onReleaseDocSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newReleaseFile = input.files[0];
    }
  }
  isSubmittingRelease = false;
  submitRelease(): void {
    if (this.isSubmittingRelease || !this.newReleaseFile || !this.newReleaseVersion) return;
  
    this.isSubmittingRelease = true;
  
    this.assetService.uploadReleaseDocumentation(this.newReleaseFile).pipe(
      switchMap((docPath: string) => {
        const payload = {
          originalAssetId: this.assetId,
          version: this.newReleaseVersion,
          documentation: docPath,
          fileUrl: "/uploads/fake-release.zip"
        };
        return this.assetService.uploadAssetReleaseFull(payload);
      })
    ).subscribe({
      next: () => {
        this.loadReleases();
        alert('Release added successfully.');
        this.newReleaseVersion = '';
        this.newReleaseFile = null;
        this.showAddRelease = false;
        this.isSubmittingRelease = false;
      },
      error: (err) => {
        console.error('Failed to submit release:', err);
        alert('Failed to submit release.');
        this.isSubmittingRelease = false;
      }
    });
    this.addSubtypeFields(this.assetForm.get('assetType')?.value);
    this.assetForm.get('assetType')?.valueChanges.subscribe(type => {
      this.addSubtypeFields(type);
    });

  }
  

  getSafeDoc(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8081' + path);
  }

  submitAssetUpdate(): void {
    if (this.assetForm.valid) {
      const updatedAsset = this.assetForm.getRawValue();
      this.assetService.updateAsset(this.assetId, updatedAsset).subscribe(() => {
        alert('Asset updated successfully.');
      });
    }
  } 
  getSafeDocDirect(docPath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8081' + docPath);
  }
  addSubtypeFields(type: string, asset?: any) {
    const controls = this.assetForm.controls;
  
    ['icon', 'framework', 'format', 'themeType', 'primaryColor', 'templateCategory', 'preconfigured', 'dependencies']
      .forEach(field => controls[field] && this.assetForm.removeControl(field));
  
    switch (type) {
      case 'Widget':
      case 'Sheet':
        this.assetForm.addControl('icon', this.fb.control(asset?.icon || '', Validators.required));
        this.assetForm.addControl('framework', this.fb.control(asset?.framework || '', Validators.required));
        if (type === 'Sheet') {
          this.assetForm.addControl('format', this.fb.control(asset?.format || '', Validators.required));
        }
        break;
      case 'Theme':
        this.assetForm.addControl('themeType', this.fb.control(asset?.themeType || '', Validators.required));
        this.assetForm.addControl('primaryColor', this.fb.control(asset?.primaryColor || '', Validators.required));
        this.assetForm.addControl('framework', this.fb.control(asset?.framework || '', Validators.required));
        break;
      case 'Template':
        this.assetForm.addControl('templateCategory', this.fb.control(asset?.templateCategory || '', Validators.required));
        this.assetForm.addControl('framework', this.fb.control(asset?.framework || '', Validators.required));
        break;
      case 'Connector':
        this.assetForm.addControl('preconfigured', this.fb.control(asset?.preconfigured ?? false));
        break;
      case 'Utility':
        this.assetForm.addControl('dependencies', this.fb.control(asset?.dependencies || '', Validators.required));
        break;
    }
  }
  
  
}
