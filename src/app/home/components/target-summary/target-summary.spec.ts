import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSummary } from './target-summary';

describe('TargetSummary', () => {
  let component: TargetSummary;
  let fixture: ComponentFixture<TargetSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
