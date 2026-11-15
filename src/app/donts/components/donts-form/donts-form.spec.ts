import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DontsForm } from './donts-form';

describe('DontsForm', () => {
  let component: DontsForm;
  let fixture: ComponentFixture<DontsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DontsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DontsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
