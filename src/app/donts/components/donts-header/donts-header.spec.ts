import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DontsHeader } from './donts-header';

describe('DontsHeader', () => {
  let component: DontsHeader;
  let fixture: ComponentFixture<DontsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DontsHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(DontsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
