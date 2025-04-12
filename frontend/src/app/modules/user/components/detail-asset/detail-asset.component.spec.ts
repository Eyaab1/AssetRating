import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAssetComponent } from './detail-asset.component';

describe('DetailAssetComponent', () => {
  let component: DetailAssetComponent;
  let fixture: ComponentFixture<DetailAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
