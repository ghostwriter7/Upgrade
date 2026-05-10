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
    const json: SessionJson = this.parseSessionJSON(data);

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
      if (!this.isRecord(data)) {
        throw new TypeError('Invalid session data: expected object');
      }

      return {
        uuid: this.readString(data, 'uuid'),
        createdAt: this.readString(data, 'createdAt'),
        finishedAt: this.readNullableString(data, 'finishedAt'),
        startedAt: this.readString(data, 'startedAt'),
        notes: this.readNullableString(data, 'notes'),
        exerciseEntries: this.readExerciseEntries(data),
      };
  }

  private static readExerciseEntries(data: Record<string, unknown>): SessionJson['exerciseEntries'] {
    const entries = data['exerciseEntries'];

    if (!this.isArray(entries)) {
      throw new TypeError('Invalid session data: exerciseEntries must be an array');
    }

    return entries.map((entry) => {
      if (!this.isRecord(entry)) {
        throw new TypeError('Invalid session data: exerciseEntries must contain only objects');
      }

      return {
        exerciseId: this.readString(entry, 'exerciseId'),
        notes: this.readNullableString(entry, 'notes'),
        sets: this.readSets(entry)
      }
    });
  }

  private static readSets(entry: Record<string, unknown>): SessionJson['exerciseEntries'][number]['sets'] {
    const sets = entry['sets'];
    if (!this.isArray(sets)) {
      throw new TypeError('Invalid session data: sets must be an array');
    }

    return sets.map((set) => {
      if (!this.isRecord(set)) {
        throw new TypeError('Invalid session data: sets must contain only objects');
      }

      const type = this.readString(set, 'type');

      switch (type) {
        case 'bodyweight': return {
          type,
          reps: this.readNumber(set, 'reps')
        };
        case 'weight': return {
          type,
          reps: this.readNumber(set, 'reps'),
          weight: this.readNumber(set, 'weight')
        };
        case 'iso': return {
          type,
          duration: this.readNumber(set, 'duration'),
          weight: this.readOptionalNumber(set, 'weight')
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
