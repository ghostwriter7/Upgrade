import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { ExerciseMediaDto, ExerciseMediaSchema } from '../schema/media.schema';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { StoreName } from './store-name.enum';
import { ExerciseMediaMapper } from '../mapper/exercise-media.mapper';
import { IndexName } from './index-name.enum';

@Injectable({ providedIn: 'root' })
export class MediaRepository extends GenericRepository<ExerciseMediaDto> {
  constructor() {
    super();
  }

  public async findAllByExerciseLogId(exerciseLogId: string): Promise<ExerciseMedia[]> {
    return super
      .findAllBy(StoreName.MEDIA, (store: IDBObjectStore) =>
        store.index(IndexName.MediaByExerciseLogId).getAll(exerciseLogId),
      )
      .then((media) =>
        Iterator.from(media)
          .map((entry) => ExerciseMediaSchema.parse(entry))
          .map(ExerciseMediaMapper.INSTANCE.toDomain)
          .toArray(),
      );
  }

  public save(media: ExerciseMedia): Promise<IDBValidKey> {
    return this.put(StoreName.MEDIA, ExerciseMediaMapper.INSTANCE.toDto(media));
  }

  public deleteMedia(mediaId: string): Promise<void> {
    return super.delete(StoreName.MEDIA, mediaId);
  }

  public deleteAllByExerciseLogId(exerciseLogId: string): Promise<void> {
    return super.deleteAllByIndex(StoreName.MEDIA, IndexName.MediaByExerciseLogId, exerciseLogId);
  }
}
