import { Injectable } from '@angular/core';
import { GenericRepository } from './generic.repository';
import { ExerciseMediaSchema } from '../schema/media.schema';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { ExerciseMediaMapper } from '../mapper/exercise-media.mapper';

@Injectable({ providedIn: 'root' })
export class MediaRepository extends GenericRepository {
  constructor() {
    super();
  }

  public async findAllByExerciseLogId(exerciseLogId: string): Promise<ExerciseMedia[]> {
    const results = await super.queryMany(
      `
      select id,
      exercise_id as exerciseId,
      exercise_log_id as exerciseLogId,
      mime_type as mimeType,
      created_at as createdAt,
      width,
      height
      from media where exercise_log_id = :exerciseLogId
    `,
      { exerciseLogId },
    );

    return this.toDomain(results);
  }

  public save(media: ExerciseMedia): Promise<void> {
    return super.execute(
      `insert into media (id, exercise_id, exercise_log_id, mime_type, created_at, width, height)
            values (:id, :exerciseId, :exerciseLogId, :mimeType, :createdAt, :width, :height)`,
      {
        id: media.id,
        exerciseId: media.exerciseId,
        exerciseLogId: media.exerciseLogId,
        mimeType: media.mimeType,
        createdAt: media.createdAt.toString(),
        width: media.size.width,
        height: media.size.height,
      },
    );
  }

  public deleteMedia(mediaId: string): Promise<void> {
    return super.execute(`delete from media where id = :mediaId`, { mediaId });
  }

  public async getAllMedia(): Promise<ExerciseMedia[]> {
    const results = await super.queryMany(`
      select id,
             exercise_id     as exerciseId,
             exercise_log_id as exerciseLogId,
             mime_type       as mimeType,
             created_at      as createdAt,
             width,
             height
      from media;`);
    return this.toDomain(results);
  }

  public deleteAllMedia(): Promise<void> {
    return super.execute(`delete from media`);
  }

  private toDomain(results: unknown[]): ExerciseMedia[] {
    return Iterator.from(results)
      .map((entry) => ExerciseMediaSchema.parse(entry))
      .map(ExerciseMediaMapper.INSTANCE.toDomain)
      .toArray();
  }
}
