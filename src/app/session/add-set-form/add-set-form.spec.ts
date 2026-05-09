import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSetForm } from './add-set-form';

describe('AddSetForm', () => {
  let component: AddSetForm;
  let fixture: ComponentFixture<AddSetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSetForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSetForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
