import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpeInput } from './rpe-input';

describe('RpeInput', () => {
  let component: RpeInput;
  let fixture: ComponentFixture<RpeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpeInput],
    }).compileComponents();

    fixture = TestBed.createComponent(RpeInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
