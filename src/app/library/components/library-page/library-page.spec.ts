import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryPage } from './library-page';

describe('LibraryPage', () => {
  let component: LibraryPage;
  let fixture: ComponentFixture<LibraryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
