import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetListAdminComponent } from './asset-list-admin.component';

describe('AssetListAdminComponent', () => {
  let component: AssetListAdminComponent;
  let fixture: ComponentFixture<AssetListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
