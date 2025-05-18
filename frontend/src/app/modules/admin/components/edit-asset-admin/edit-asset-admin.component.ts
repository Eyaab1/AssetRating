import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AdminAssetService } from '../../../../shared/services/adminServices/admin-asset.service';

import { Asset } from '../../../../shared/models/asset';
import { AssetRelease } from '../../../../shared/models/asset-release';
import { LicenseType } from '../../../../shared/enums/LicenseType';
import { StatusType } from '../../../../shared/enums/StatusType';
import { ProjectType } from '../../../../shared/enums/ProjectType';
import { Framework } from '../../../../shared/enums/framework';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-asset-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-asset-admin.component.html',
  styleUrls: ['./edit-asset-admin.component.css']
})
export class EditAssetAdminComponent implements OnInit {
  assetForm!: FormGroup;
  assetId!: string;
  assetReleases: AssetRelease[] = [];
  selectedRelease?: AssetRelease;
  activeTab: string = 'general';
  showAddRelease: boolean = false;
  newReleaseVersion: string = '';
  selectedReleaseDoc?: File;
  isSubmittingRelease: boolean = false;
  licenseOptions = Object.values(LicenseType);
  statusOptions = Object.values(StatusType);
  projectTypes = Object.values(ProjectType);
  frameworks = Object.values(Framework);
  subtypeFieldsPresent = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminAssetService: AdminAssetService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.assetId = id;
        this.loadAsset(id);
        this.loadReleases(id);
      }
    });
  }

  loadAsset(id: string): void {
    this.adminAssetService.getAssetById(id).subscribe(asset => {
      this.assetForm = this.fb.group({
        name: [asset.name, Validators.required],
        label: [asset.label, Validators.required],
        type: [asset.type],
        publisher: [asset.publisher],
        publisherMail: [asset.publisherMail],
        publishDate: [asset.publishDate],
        license: [asset.license],
        status: [asset.status],
        projectType: [asset.projectType],
        description: [asset.description],
        icon: [asset.image],
        ...(asset.framework && { framework: [asset.framework] }),
        ...(asset.format && { format: [asset.format] }),
        ...(asset.themeType && { themeType: [asset.themeType] }),
        ...(asset.primaryColor && { primaryColor: [asset.primaryColor] }),
        ...(asset.templateCategory && { templateCategory: [asset.templateCategory] }),
        ...(asset.preconfigured !== undefined && { preconfigured: [asset.preconfigured] }),
        ...(asset.dependencies && { dependencies: [asset.dependencies] }),
      });

      this.subtypeFieldsPresent =
        !!asset.framework ||
        !!asset.format ||
        !!asset.themeType ||
        !!asset.primaryColor ||
        !!asset.templateCategory ||
        asset.preconfigured !== undefined ||
        !!asset.dependencies;
    });
  }

  loadReleases(assetId: string): void {
    this.adminAssetService.getReleasesByAsset(assetId).subscribe(releases => {
      this.assetReleases = releases;
    });
  }

  toggleRelease(releaseId: number): void {
    this.selectedRelease =
      this.selectedRelease?.id === releaseId
        ? undefined
        : this.assetReleases.find(r => r.id === releaseId);
  }

  onReleaseDocSelect(event: any): void {
    this.selectedReleaseDoc = event.target.files[0];
  }

  submitAssetUpdate(): void {
    if (this.assetForm.invalid) {
      Swal.fire('Invalid Form', 'Please fill out all required fields.', 'warning');
      return;
    }

    this.adminAssetService.updateAsset(this.assetId, this.assetForm.value).subscribe(() => {
      Swal.fire('Success', 'Asset updated successfully.', 'success');
    });
  }

  submitRelease(): void {
    if (!this.newReleaseVersion || !this.selectedReleaseDoc) return;

    this.isSubmittingRelease = true;

    this.adminAssetService.uploadReleaseDocumentation(this.selectedReleaseDoc).subscribe({
      next: (docPath: string) => {
        const payload = {
          originalAssetId: this.assetId,
          version: this.newReleaseVersion,
          documentation: docPath,
          fileUrl: '' // if you don't use this, backend can ignore it or you send a dummy string
        };

        this.adminAssetService.uploadAssetRelease(payload).subscribe({
          next: () => {
            this.loadReleases(this.assetId);
            this.newReleaseVersion = '';
            this.selectedReleaseDoc = undefined;
            this.showAddRelease = false;
            this.isSubmittingRelease = false;
            Swal.fire('Success', 'Release added.', 'success');
          },
          error: () => {
            this.isSubmittingRelease = false;
            Swal.fire('Error', 'Failed to add release.', 'error');
          }
        });
      },
      error: () => {
        this.isSubmittingRelease = false;
        Swal.fire('Error', 'Failed to upload documentation.', 'error');
      }
    });
  }


  getIcon(iconPath: string): string {
    return `http://localhost:8081/assets/${iconPath}`;
  }

  getSafeDocDirect(docUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:8081/assets/${docUrl}`);
  }
}
