import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DontsEntry } from './donts-entry';

describe('DontsEntry', () => {
  let component: DontsEntry;
  let fixture: ComponentFixture<DontsEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DontsEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(DontsEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
