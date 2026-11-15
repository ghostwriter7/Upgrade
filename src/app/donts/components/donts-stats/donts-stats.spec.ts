import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DontsStats } from './donts-stats';

describe('DontsStats', () => {
  let component: DontsStats;
  let fixture: ComponentFixture<DontsStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DontsStats],
    }).compileComponents();

    fixture = TestBed.createComponent(DontsStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
