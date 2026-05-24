import { StoreName } from '../repository/store-name.enum';
import { SessionDto } from '../schema/session.schema';
import { ExerciseSetDto } from '../schema/set.schema';

export class ExerciseSetMigration {
  public async perform(transaction: IDBTransaction): Promise<void> {
    const request = transaction.objectStore(StoreName.SESSIONS).getAll();

    request.onsuccess = (e) => {
      const sessions = (e.target as IDBRequest).result as SessionDto[];
      const sets = sessions.flatMap((session) =>
        session.exerciseEntries.flatMap((exercise) =>
          ((exercise as unknown as { sets: ExerciseSetDto[] }).sets || []).map((set, index) => ({
            ...set,
            index,
            sessionId: session.uuid,
            exerciseId: exercise.exerciseId,
          })),
        ),
      );

      const store = transaction.objectStore(StoreName.SETS);

      sets.forEach((set) => store.put(set));
    };
  }
}
