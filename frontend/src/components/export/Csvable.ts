import { ArrayTable } from './ArrayTable';

export type Csvable = {
  toCsvTable(): ArrayTable;
};
