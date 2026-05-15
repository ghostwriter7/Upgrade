import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetForm } from './set-form';

describe('SetForm', () => {
  let component: SetForm;
  let fixture: ComponentFixture<SetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SetForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
