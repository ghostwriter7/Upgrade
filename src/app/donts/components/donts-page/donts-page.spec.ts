import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DontsPage } from './donts-page';

describe('DontsPage', () => {
  let component: DontsPage;
  let fixture: ComponentFixture<DontsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DontsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DontsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
