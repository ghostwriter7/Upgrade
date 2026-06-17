import { SetData } from '../set-form/set-data.interface';

export interface UpsertSetDialogData {
  set: SetData;
  exerciseId: string;
  label?: string;
  button?: string;
}
