import { FormField } from './formBuilder';

export interface FormFieldPosition {
  row: number;
  column: number;
  width: 1 | 2 | 3 | 4 | 6 | 12; // Based on 12-column grid
}

export interface FormRow {
  id: string;
  fields: (FormField | null)[]; // null represents empty slots
  columns: number; // 1, 2, 3, 4, 6, 12
}

export interface FormLayout {
  rows: FormRow[];
}

export interface FormFieldWithPosition extends FormField {
  position?: FormFieldPosition;
  rowId?: string;
  columnIndex?: number;
}