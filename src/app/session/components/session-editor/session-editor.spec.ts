import { ComponentFixture, TestBed } from '@angular/core/testing';

import SessionEditor from './session-editor';

describe('SessionEditor', () => {
  let component: SessionEditor;
  let fixture: ComponentFixture<SessionEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
