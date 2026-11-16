import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBar } from './tab-bar';

describe('TabBar', () => {
  let component: TabBar;
  let fixture: ComponentFixture<TabBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabBar],
    }).compileComponents();

    fixture = TestBed.createComponent(TabBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
