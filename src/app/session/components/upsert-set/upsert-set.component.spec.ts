import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertSet } from './upsert-set.component';

describe('EditSet', () => {
  let component: UpsertSet;
  let fixture: ComponentFixture<UpsertSet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertSet],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertSet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
