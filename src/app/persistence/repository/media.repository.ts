import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { ExerciseMediaDto } from '../schema/media.schema';
import { ExerciseMedia } from '../../domain/model/exercise-media.model';
import { StoreName } from './store-name.enum';
import { ExerciseMediaMapper } from '../mapper/exercise-media.mapper';

@Injectable({ providedIn: 'root' })
export class MediaRepository extends GenericRepository<ExerciseMediaDto> {
  constructor() {
    super();
  }

  public async findMedia(id: string): Promise<ExerciseMedia | null> {
    const result = await super.findById(StoreName.MEDIA, id);
    return result ? ExerciseMediaMapper.INSTANCE.toDomain(result) : null;
  }

  public save(media: ExerciseMedia): Promise<IDBValidKey> {
    return this.put(StoreName.MEDIA, ExerciseMediaMapper.INSTANCE.toDto(media));
  }

  public deleteMedia(mediaId: string): Promise<boolean> {
    return super.delete(StoreName.MEDIA, mediaId);
  }
}
