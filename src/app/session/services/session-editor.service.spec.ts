import { TestBed } from '@angular/core/testing';

import { SessionEditorService } from './session-editor.service';

describe('EditSession', () => {
  let service: SessionEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
