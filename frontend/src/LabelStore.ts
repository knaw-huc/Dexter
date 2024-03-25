import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Setter } from './utils/immer/Setter';
import { assign } from './utils/immer/assign';
import _ from 'lodash';

export const LABEL_FILE = 'labels.json';

interface LabelState {
  /**
   * Resource displayed on index page
   */
  labels: Labels;
  setLabels: Setter<Labels>;
  getLabel: (label: LabelKey) => string;
}

export const useLabelStore = create<LabelState>()(
  immer((set, get) => ({
    labels: {} as Labels,
    setLabels: labels => set(state => assign(state.labels, labels)),
    getLabel: key => {
      const label = get().labels[key];
      if (!label) {
        console.warn('Missing label: ' + key);
      }
      return label ?? key;
    },
  })),
);

export type LabelKey = 'HELP_SOURCE_CREATOR' | 'HELP_SOURCE_RIGHTS';
export type Labels = Partial<Record<LabelKey, string>>;

export function fromFormFieldToHint(resource: string) {
  return function (field: string) {
    return `HELP_FORM_${format(resource)}_FIELD_${format(field)}` as LabelKey;
  };

  function format(part: string) {
    return _.snakeCase(part).toUpperCase();
  }
}
