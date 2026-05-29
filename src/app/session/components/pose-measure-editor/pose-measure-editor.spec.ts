import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseMeasureEditor } from './pose-measure-editor';

describe('PoseMeasureEditor', () => {
  let component: PoseMeasureEditor;
  let fixture: ComponentFixture<PoseMeasureEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoseMeasureEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(PoseMeasureEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
