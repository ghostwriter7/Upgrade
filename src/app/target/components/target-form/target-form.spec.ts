import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetForm } from './target-form';

describe('TargetForm', () => {
  let component: TargetForm;
  let fixture: ComponentFixture<TargetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
