import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetails } from './entry-details';

describe('EntryDetails', () => {
  let component: EntryDetails;
  let fixture: ComponentFixture<EntryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
