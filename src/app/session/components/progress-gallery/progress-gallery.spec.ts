import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressGallery } from './progress-gallery';
import { Mock } from 'vitest';
import { QueryBus } from '@common/routers/query/query-bus';
import { By } from '@angular/platform-browser';
import { CommandBus } from '@common/routers/command/command-bus';

describe('ProgressGallery', () => {
  let component: ProgressGallery;
  let fixture: ComponentFixture<ProgressGallery>;
  let queryBus: { execute: Mock };
  let commandBus: { execute: Mock };

  const exerciseLogId = 'exerciseLogId';

  beforeEach(async () => {
    queryBus = { execute: vi.fn().mockResolvedValue([]) };
    commandBus = { execute: vi.fn() };
    await TestBed.configureTestingModule({
      providers: [
        { provide: QueryBus, useValue: queryBus },
        { provide: CommandBus, useValue: commandBus },
      ],
      imports: [ProgressGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressGallery);
    fixture.componentRef.setInput('exerciseLogId', exerciseLogId);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nothing when there are no media & measurements for an exercise log id', () =>
    expect(fixture.debugElement.queryAll(By.css('.slide')).length).toBe(0));
});
