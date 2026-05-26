import { inject, Injectable } from '@angular/core';
import { SetRepository } from '../../../persistence/repository/set.repository';

@Injectable({ providedIn: 'root' })
export class SetIdProvider {
  private readonly setRepository = inject(SetRepository);

  private nextId: number = -1;

  constructor() {
    this.initializeNextId();
  }

  public nextSetId(): number {
    return this.nextId++;
  }

  private initializeNextId(): void {
    this.setRepository.getLatestSetId().then((id) => {
      this.nextId = id + 1;
    });
  }
}
