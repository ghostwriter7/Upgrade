import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureProgress } from './measure-progress';

describe('MeasureProgress', () => {
  let component: MeasureProgress;
  let fixture: ComponentFixture<MeasureProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasureProgress],
    }).compileComponents();

    fixture = TestBed.createComponent(MeasureProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
