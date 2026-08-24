import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPage } from './target-page';

describe('TargetPage', () => {
  let component: TargetPage;
  let fixture: ComponentFixture<TargetPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
