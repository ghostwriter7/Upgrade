import { GenericRepository } from './generic.repository';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { Injectable } from '@angular/core';
import { StoreName } from './store-name.enum';
import { ExerciseSetMapper } from '../mapper/exercise-set.mapper';

@Injectable({ providedIn: 'root' })
export class SetRepository extends GenericRepository<ExerciseSet> {
  constructor() {
    super();
  }

  public deleteSet(setId: number): Promise<boolean> {
    return super.delete(StoreName.SETS, setId);
  }

  public async upsertSet(set: ExerciseSet): Promise<number> {
    const dto = ExerciseSetMapper.INSTANCE.toDto(set);
    const key = await super.put(StoreName.SETS, dto);

    if (typeof key === 'number') {
      return key;
    }

    throw new Error('Invalid key type');
  }
}
