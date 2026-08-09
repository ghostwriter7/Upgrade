import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesList } from './templates-list';

describe('TemplatesList', () => {
  let component: TemplatesList;
  let fixture: ComponentFixture<TemplatesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesList],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplatesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
