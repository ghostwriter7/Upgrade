import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressGallery } from './progress-gallery';

describe('ProgressGallery', () => {
  let component: ProgressGallery;
  let fixture: ComponentFixture<ProgressGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
