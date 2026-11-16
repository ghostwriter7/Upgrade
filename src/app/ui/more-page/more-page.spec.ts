import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorePage } from './more-page';

describe('MorePage', () => {
  let component: MorePage;
  let fixture: ComponentFixture<MorePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorePage],
    }).compileComponents();

    fixture = TestBed.createComponent(MorePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
