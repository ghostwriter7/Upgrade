import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSet } from './edit-set';

describe('EditSet', () => {
  let component: EditSet;
  let fixture: ComponentFixture<EditSet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSet],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
