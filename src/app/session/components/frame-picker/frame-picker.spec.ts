import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FramePicker } from './frame-picker';

describe.skip('FramePicker', () => {
  let component: FramePicker;
  let fixture: ComponentFixture<FramePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FramePicker],
    }).compileComponents();

    fixture = TestBed.createComponent(FramePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
