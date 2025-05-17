import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingDistributionForAssetComponent } from './rating-distribution-for-asset.component';

describe('RatingDistributionForAssetComponent', () => {
  let component: RatingDistributionForAssetComponent;
  let fixture: ComponentFixture<RatingDistributionForAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingDistributionForAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingDistributionForAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
