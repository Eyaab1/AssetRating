import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Asset, AssetType, LicenseType, StatusType } from '../../../../shared/models/asset';
import{ AssetServiceService } from '../../../../shared/services/asset-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-asset-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-asset-form.component.html',
  styleUrl: './add-asset-form.component.css'
})
export class AddAssetFormComponent {
  assetForm: FormGroup;
  assetTypes: AssetType[] = ['Widget', 'Utility', 'Sheet', 'Theme', 'Template'];
  licenseOptions: LicenseType[] = ['Free', 'Paid'];
  statusOptions: StatusType[] = ['published', 'unpublished', 'deleted'];

  constructor(private fb: FormBuilder, private assetService: AssetServiceService) {
    this.assetForm = this.fb.group({
      // id: ['', Validators.required],
      name: ['', Validators.required],
      label: ['', Validators.required],
      publisher: ['', Validators.required],
      publisherMail: ['', [Validators.required, Validators.email]],
      publishDate: ['', Validators.required],
      license: ['Free', Validators.required],
      status: ['Published', Validators.required],
      image: [''],
      description: [''],
      documentation: [''],
      assetType: ['Widget', Validators.required]
    });
  }

  submitAsset() {
    if (this.assetForm.valid) {
      const asset: Asset = {
        ...this.assetForm.value,
        id: this.generateId()  
      };
  
      this.assetService.addAsset(asset).subscribe({
        next: () => {
          alert(`Asset of type '${asset.assetType}' created successfully!`);
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
  
  // Auto-generate ID
  generateId(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }
}
