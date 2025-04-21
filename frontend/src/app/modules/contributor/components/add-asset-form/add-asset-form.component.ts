import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import{ AssetServiceService } from '../../../../shared/services/asset-service.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; 
@Component({
  selector: 'app-add-asset-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-asset-form.component.html',
  styleUrl: './add-asset-form.component.css'
})
export class AddAssetFormComponent {
  assetForm: FormGroup;

  assetTypes = Object.values(AssetType);
  licenseOptions = Object.values(LicenseType);
  statusOptions = Object.values(StatusType);
  projectTypes = Object.values(ProjectType);

  constructor(private fb: FormBuilder, private assetService: AssetServiceService) {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      label: ['', Validators.required],
      publisher: [''],
      publisherMail: ['', [Validators.required, Validators.email]],
      publishDate: ['', Validators.required],
      license: [LicenseType.Free, Validators.required],
      status: [StatusType.Published, Validators.required],
      image: [''],
      description: [''],
      documentation: [''],
      assetType: [AssetType.Widget, Validators.required],
      projectType: [ProjectType.Frontend, Validators.required]
    });
  }

  submitAsset() {
    if (this.assetForm.valid) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        this.assetForm.patchValue({
          publisherMail: decoded.sub,
          publisher: `${decoded.firstName ?? 'Anonymous'} ${decoded.lastName ?? ''}`.trim()
        });
      }

      const asset: Asset = {
        ...this.assetForm.value,
        id: this.generateId(),
        type: this.assetForm.value.assetType,               
        license: this.assetForm.value.license.toUpperCase(), 
        status: this.assetForm.value.status.toUpperCase(),   
        tags: [],
        categories: []
      };

      this.assetService.addAsset(asset).subscribe({
        next: () => {
          alert(`Asset of type '${asset.type}' created successfully!`);
          this.assetForm.reset({ license: 'Free', status: 'Published', assetType: 'Widget' });
        },
        error: (err) => {
          console.error('Asset creation failed:', err);
          alert('Failed to create asset.');
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }
}
