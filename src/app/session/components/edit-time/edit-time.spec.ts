import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTime } from './edit-time';

describe('EditTime', () => {
  let component: EditTime;
  let fixture: ComponentFixture<EditTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTime],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
