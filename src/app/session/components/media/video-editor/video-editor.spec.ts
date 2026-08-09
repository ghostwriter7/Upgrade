import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditor } from './video-editor';

describe('VideoEditor', () => {
  let component: VideoEditor;
  let fixture: ComponentFixture<VideoEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoEditor);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', { video: new Blob(), width: 10, height: 10 });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
