import { Query } from '@common/routers/query/query.model';
import { SetData } from '@session/components/set-form/set-data.interface';

export class GetInitialSetForExerciseIdQuery extends Query<SetData> {
  constructor(public readonly exerciseId: string) {
    super();
  }
}
