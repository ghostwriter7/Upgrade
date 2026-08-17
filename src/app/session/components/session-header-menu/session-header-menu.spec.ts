import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHeaderMenu } from './session-header-menu';

describe('SessionHeaderMenu', () => {
  let component: SessionHeaderMenu;
  let fixture: ComponentFixture<SessionHeaderMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionHeaderMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionHeaderMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
