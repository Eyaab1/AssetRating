import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetAdminComponent } from './add-asset-admin.component';

describe('AddAssetAdminComponent', () => {
  let component: AddAssetAdminComponent;
  let fixture: ComponentFixture<AddAssetAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAssetAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAssetAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
