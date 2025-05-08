import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAssetListComponent } from './full-asset-list.component';

describe('FullAssetListComponent', () => {
  let component: FullAssetListComponent;
  let fixture: ComponentFixture<FullAssetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullAssetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
