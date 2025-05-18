import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetAdminComponent } from './edit-asset-admin.component';

describe('EditAssetAdminComponent', () => {
  let component: EditAssetAdminComponent;
  let fixture: ComponentFixture<EditAssetAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssetAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssetAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
