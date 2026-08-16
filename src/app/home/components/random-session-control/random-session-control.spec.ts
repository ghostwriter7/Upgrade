import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomSessionControl } from './random-session-control';

describe('RandomSessionControl', () => {
  let component: RandomSessionControl;
  let fixture: ComponentFixture<RandomSessionControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomSessionControl],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomSessionControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
