import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Mock } from 'vitest';
import { Subject } from 'rxjs';

describe('Dialog', () => {
  let service: DialogService;
  let matDialogMock: { open: Mock };

  beforeEach(() => {
    matDialogMock = { open: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: matDialogMock }, DialogService],
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function mockDialogClose<R = unknown>(): Subject<R> {
    const afterClosed$ = new Subject<R>();

    matDialogMock.open.mockReturnValue({
      afterClosed: () => afterClosed$,
    });

    return afterClosed$;
  }

  const anyComponent = class AnyComponent {};

  it('should open the provided component with an empty config by default', () => {
    const afterClosed$ = mockDialogClose();
    const handler = vi.fn();

    service.open(anyComponent, handler);

    expect(matDialogMock.open).toHaveBeenCalledExactlyOnceWith(anyComponent, {});

    afterClosed$.complete();
  });

  it('should open the provided component with the provided config', () => {
    const afterClosed$ = mockDialogClose();
    const handler = vi.fn();

    const config: MatDialogConfig<{ id: string }> = {
      data: {
        id: 'abc',
      },
      width: '400px',
      disableClose: true,
    };

    service.open(anyComponent, handler, config);

    expect(matDialogMock.open).toHaveBeenCalledExactlyOnceWith(anyComponent, config);

    afterClosed$.complete();
  });

  it('should call the handler after the dialog closes with a truthy result', () => {
    const afterClosed$ = mockDialogClose<{ id: string }>();
    const handler = vi.fn();
    const dialogResult = {
      id: 'abc',
    };

    service.open(anyComponent, handler);

    afterClosed$.next(dialogResult);

    expect(handler).toHaveBeenCalledExactlyOnceWith(dialogResult);
  });

  it.each([undefined, null, false, 0, '', Number.NaN])(
    'should not call the handler for default filtered value: %s',
    (dialogResult) => {
      const afterClosed$ = mockDialogClose();
      const handler = vi.fn();

      service.open(anyComponent, handler);

      afterClosed$.next(dialogResult);

      expect(handler).not.toHaveBeenCalled();
    },
  );

  it('should call the handler when the custom predicate returns true', () => {
    const afterClosed$ = mockDialogClose<number>();
    const handler = vi.fn();

    service.open(anyComponent, handler, {}, (result) => result > 10);

    afterClosed$.next(15);

    expect(handler).toHaveBeenCalledExactlyOnceWith(15);
  });

  it('should not call the handler when the custom predicate returns false', () => {
    const afterClosed$ = mockDialogClose<number>();
    const handler = vi.fn();

    service.open(anyComponent, handler, {}, (result) => result > 10);

    afterClosed$.next(5);

    expect(handler).not.toHaveBeenCalled();
  });
});
