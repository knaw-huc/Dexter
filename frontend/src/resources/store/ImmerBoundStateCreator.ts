import { StateCreator } from 'zustand';
import 'zustand/middleware/immer';

export type ImmerBoundStateCreator<BOUND, SLICE> = StateCreator<
  BOUND,
  [['zustand/immer', never], never],
  [],
  SLICE
>;
