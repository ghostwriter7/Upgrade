import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { Component } from '@angular/core';
import { LayoutComponent } from '@ui/layout/layout.component';
import { Mock } from 'vitest';
import { EventService } from '@common/service/event/event.service';
import { ElementClickedEvent } from '@common/events/element-clicked.event';

@Component({ selector: 'app-layout', template: '<div></div>' })
class LayoutMock {}

describe('App', () => {
  let eventServiceMock: { dispatch: Mock };
  let fixture: ComponentFixture<App>;
  let app: App;

  beforeEach(async () => {
    eventServiceMock = { dispatch: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: EventService, useValue: eventServiceMock }],
    })
      .overrideComponent(App, {
        add: { imports: [LayoutMock] },
        remove: { imports: [LayoutComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should dispatch an event upon a click anywhere on the document', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.click();

    expect(eventServiceMock.dispatch).toHaveBeenCalledExactlyOnceWith(
      new ElementClickedEvent(button),
    );
  });
});
