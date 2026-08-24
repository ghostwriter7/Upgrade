import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetView } from './target-view';

describe('TargetView', () => {
  let component: TargetView;
  let fixture: ComponentFixture<TargetView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetView],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
