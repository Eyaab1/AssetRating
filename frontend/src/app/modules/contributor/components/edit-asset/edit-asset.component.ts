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
import Swal from 'sweetalert2';
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
  assetTypes = Object.values(AssetType);
  subtypeFieldsPresent = false;

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
        name: [asset.name],
        label: [asset.label],
        publisher: [{ value: asset.publisher, disabled: true }],
        publisherMail: [{ value: asset.publisherMail, disabled: true }],
        publishDate: [{ value: asset.publishDate, disabled: true }],
        license: [asset.license],
        status: [asset.status],
        projectType: [asset.projectType], 
        description: [asset.description],
        type: [{ value: asset.type, disabled: true }]
      });
  
      this.addSubtypeFields(asset.type, asset);
  
      this.assetForm.get('type')?.valueChanges.subscribe(type => {
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
      this.assetForm.patchValue({ icon: file.name }); 
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
  if (this.isSubmittingRelease || !this.newReleaseFile || !this.newReleaseVersion) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Fields',
      text: 'You must enter a version and select a file.',
    });
    return;
  }

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
      Swal.fire({
        icon: 'success',
        title: 'Release Added',
        text: 'The release has been added successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      this.newReleaseVersion = '';
      this.newReleaseFile = null;
      this.showAddRelease = false;
      this.isSubmittingRelease = false;
    },
    error: (err) => {
      console.error('Failed to submit release:', err);
      Swal.fire({
        icon: 'error',
        title: 'Release Failed',
        text: 'Could not submit the release. Please try again.',
      });
      this.isSubmittingRelease = false;
    }
  });
}
  

  getSafeDoc(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8081' + path);
  }

submitAssetUpdate(): void {
  const type = this.assetForm.get('type')?.value;
  this.addSubtypeFields(type, this.assetSelected);

  if (this.assetForm.valid) {
    Swal.fire({
      title: 'Save Changes?',
      text: 'Are you sure you want to update this asset?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        const updatedAsset = {
          ...this.assetForm.getRawValue(),
          type: this.assetSelected?.type || this.assetForm.get('type')?.value
        };

        this.assetService.updateAsset(this.assetId, updatedAsset).subscribe(() => {
          Swal.fire({
            title: 'Updated!',
            text: 'Asset updated successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Form Incomplete',
      text: 'Please fill all required fields before updating.',
    });
  }
}



// submitAssetUpdate(): void {
//   console.log('Submit clicked');

//   Swal.fire({
//     title: 'Save Changes?',
//     text: 'Are you sure you want to update this asset?',
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonText: 'Yes, save it!',
//     cancelButtonText: 'Cancel'
//   }).then(result => {
//     if (result.isConfirmed) {
//       console.log('Confirmed by user');
//       const updatedAsset = {
//         ...this.assetForm.getRawValue(),
//         type: this.assetForm.get('type')?.value
//       };

//       this.assetService.updateAsset(this.assetId, updatedAsset).subscribe(() => {
//         Swal.fire('Updated!', 'Asset has been updated.', 'success');
//       });
//     }
//   }).catch(err => {
//     console.error('SweetAlert failed:', err);
//   });
// }

  
  getSafeDocDirect(docPath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8081' + docPath);
  }
  addSubtypeFields(type: string, asset?: any) {
  const controls = this.assetForm.controls;

  // Clear previous subtype fields
  ['icon', 'framework', 'format', 'themeType', 'primaryColor', 'templateCategory', 'preconfigured', 'dependencies']
    .forEach(field => controls[field] && this.assetForm.removeControl(field));

  this.subtypeFieldsPresent = false;

  switch (type) {
    case 'Widget':
    case 'Sheet':
      this.assetForm.addControl('icon', this.fb.control(asset?.icon || ''));
      this.assetForm.addControl('framework', this.fb.control(asset?.framework || ''));
      this.subtypeFieldsPresent = true;
      if (type === 'Sheet') {
        this.assetForm.addControl('format', this.fb.control(asset?.format ));
      }
      break;
    case 'Theme':
      this.assetForm.addControl('themeType', this.fb.control(asset?.themeType || ''));
      this.assetForm.addControl('primaryColor', this.fb.control(asset?.primaryColor || ''));
      this.assetForm.addControl('framework', this.fb.control(asset?.framework || ''));
      this.subtypeFieldsPresent = true;
      break;
    case 'Template':
      this.assetForm.addControl('templateCategory', this.fb.control(asset?.templateCategory || ''));
      this.assetForm.addControl('framework', this.fb.control(asset?.framework || ''));
      this.subtypeFieldsPresent = true;
      break;
    case 'Connector':
      this.assetForm.addControl('preconfigured', this.fb.control(asset?.preconfigured ?? false));
      this.subtypeFieldsPresent = true;
      break;
    case 'Utility':
      this.assetForm.addControl('dependencies', this.fb.control(asset?.dependencies || ''));
      this.subtypeFieldsPresent = true;
      break;
  }
}

  
  
}
