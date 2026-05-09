import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetView } from './set-view';

describe('SetView', () => {
  let component: SetView;
  let fixture: ComponentFixture<SetView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetView],
    }).compileComponents();

    fixture = TestBed.createComponent(SetView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
