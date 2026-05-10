import { ExerciseEntry, Session } from '../model/session.model';
import { BodyweightSet, IsoSet, WeightedSet } from '../model/exercise-set.model';

interface SessionJson {
  uuid: string;
  createdAt: string;
  startedAt: string;
  finishedAt: string | null;
  notes: string | null;
  exerciseEntries: {
    exerciseId: string;
    notes: string | null;
    sets: (
      | { type: 'bodyweight'; reps: number }
      | { type: 'iso'; duration: number; weight?: number }
      | { type: 'weight'; reps: number; weight: number }
    )[];
  }[];
}

export class SessionFactory {
  public static fromJSON(data: unknown): Session {
    const json: SessionJson = SessionFactory.parseSessionJSON(data);

    const session = new Session(json.uuid, json.createdAt);
    session.startedAt = json.startedAt;
    session.finishedAt = json.finishedAt;
    session.notes = json.notes;
    session.exerciseEntries = json.exerciseEntries.map(SessionFactory.toExerciseEntry);
    return session;
  }

  private static toExerciseEntry(entry: SessionJson['exerciseEntries'][number]): ExerciseEntry {
      const exerciseEntry = new ExerciseEntry(entry.exerciseId);
      exerciseEntry.notes = entry.notes;
      exerciseEntry.sets = entry.sets.map((set) => {
        switch (set.type) {
          case 'bodyweight':
            return new BodyweightSet(set.reps);
          case 'weight':
            return new WeightedSet(set.reps, set.weight);
          case 'iso':
            return new IsoSet(set.duration, set.weight);
        }
      });
      return exerciseEntry;
  }

  private static parseSessionJSON(data: unknown): SessionJson {
      if (!SessionFactory.isRecord(data)) {
        throw new TypeError('Invalid session data: expected object');
      }

      return {
        uuid: SessionFactory.readString(data, 'uuid'),
        createdAt: SessionFactory.readString(data, 'createdAt'),
        finishedAt: SessionFactory.readNullableString(data, 'finishedAt'),
        startedAt: SessionFactory.readString(data, 'startedAt'),
        notes: SessionFactory.readNullableString(data, 'notes'),
        exerciseEntries: SessionFactory.readExerciseEntries(data),
      };
  }

  private static readExerciseEntries(data: Record<string, unknown>): SessionJson['exerciseEntries'] {
    const entries = data['exerciseEntries'];

    if (!SessionFactory.isArray(entries)) {
      throw new TypeError('Invalid session data: exerciseEntries must be an array');
    }

    return entries.map((entry) => {
      if (!SessionFactory.isRecord(entry)) {
        throw new TypeError('Invalid session data: exerciseEntries must contain only objects');
      }

      return {
        exerciseId: SessionFactory.readString(entry, 'exerciseId'),
        notes: SessionFactory.readNullableString(entry, 'notes'),
        sets: SessionFactory.readSets(entry)
      }
    });
  }

  private static readSets(entry: Record<string, unknown>): SessionJson['exerciseEntries'][number]['sets'] {
    const sets = entry['sets'];
    if (!SessionFactory.isArray(sets)) {
      throw new TypeError('Invalid session data: sets must be an array');
    }

    return sets.map((set) => {
      if (!SessionFactory.isRecord(set)) {
        throw new TypeError('Invalid session data: sets must contain only objects');
      }

      const type = SessionFactory.readString(set, 'type');

      switch (type) {
        case 'bodyweight': return {
          type,
          reps: SessionFactory.readNumber(set, 'reps')
        };
        case 'weight': return {
          type,
          reps: SessionFactory.readNumber(set, 'reps'),
          weight: SessionFactory.readNumber(set, 'weight')
        };
        case 'iso': return {
          type,
          duration: SessionFactory.readNumber(set, 'duration'),
          weight: SessionFactory.readOptionalNumber(set, 'weight')
        };
        default: throw new Error(`Invalid session data: unknown set type '${type}'`);
      }
    });
  }

  private static readNullableString(data: Record<string, unknown>, key: string): string | null {
    const value = data[key];
    if (typeof value === 'string') {
      return value;
    }
    return null;
  }

  private static readString(data: Record<string, unknown>, key: string): string {
    const value = data[key];
    if (typeof value === 'string') {
      return value;
    }
    throw new TypeError(`Invalid session data: missing or invalid '${key}'`);
  }

  private static readNumber(data: Record<string, unknown>, key: string): number {
    const value = data[key];
    if (typeof value === 'number') {
      return value;
    }
    throw new TypeError(`Invalid session data: missing or invalid '${key}'`);
  }

  private static readOptionalNumber(data: Record<string, unknown>, key: string): number | undefined {
    const value = data[key];
    if (typeof value === 'number') {
      return value;
    }
    return undefined;
  }

  private static isRecord(data: unknown): data is Record<string, unknown> {
    return data !== null && typeof data === 'object' && !Array.isArray(data);
  }

  private static isArray(data: unknown): data is Array<unknown> {
    return data !== null && typeof data === 'object' && Array.isArray(data);
  }
}
