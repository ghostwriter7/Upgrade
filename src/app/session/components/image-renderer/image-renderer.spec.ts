import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRenderer } from './image-renderer';

describe('ImageRenderer', () => {
  let component: ImageRenderer;
  let fixture: ComponentFixture<ImageRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageRenderer],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageRenderer);
    fixture.componentRef.setInput('image', 'test-image-url');
    fixture.componentRef.setInput('width', 100);
    fixture.componentRef.setInput('height', 120);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
