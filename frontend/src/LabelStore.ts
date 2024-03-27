import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Setter } from './utils/draft/Setter';
import { assign } from './utils/draft/assign';
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

export type LabelKey =
  | 'HELP_FORM_MEDIA_FIELD_TITLE'
  | 'HELP_FORM_MEDIA_FIELD_URL'
  | 'HELP_FORM_METADATA_KEY_FIELD_KEY'
  | 'HELP_FORM_REFERENCE_FIELD_REFERENCE'
  | 'HELP_FORM_SOURCE_FIELD_ACCESS'
  | 'HELP_FORM_SOURCE_FIELD_DESCRIPTION'
  | 'HELP_FORM_SOURCE_FIELD_EARLIEST'
  | 'HELP_FORM_SOURCE_FIELD_ETHICS'
  | 'HELP_FORM_SOURCE_FIELD_EXTERNAL_REF'
  | 'HELP_FORM_SOURCE_FIELD_LANGUAGES'
  | 'HELP_FORM_SOURCE_FIELD_LATEST'
  | 'HELP_FORM_SOURCE_FIELD_LOCATION'
  | 'HELP_FORM_SOURCE_FIELD_MEDIA'
  | 'HELP_FORM_SOURCE_FIELD_METADATA'
  | 'HELP_FORM_SOURCE_FIELD_NOTES'
  | 'HELP_FORM_SOURCE_FIELD_TAGS'
  | 'HELP_FORM_SOURCE_FIELD_TITLE'
  | 'HELP_FORM_TAG_FIELD_VAL'
  | 'HELP_TITLE_CORPUS_INDEX'
  | 'HELP_TITLE_MEDIA_INDEX'
  | 'HELP_TITLE_METADATA_KEY_INDEX'
  | 'HELP_TITLE_REFERENCE_INDEX'
  | 'HELP_TITLE_SOURCE_INDEX'
  | 'HELP_TITLE_TAG_INDEX'
  | 'HELP_TITLE_MEDIA_PAGE'
  | 'HELP_TITLE_SOURCE_PAGE'
  | 'HELP_TITLE_CORPUS_PAGE';

export type Labels = Partial<Record<LabelKey, string>>;

export function toFormHint(resource: string) {
  return function (field: string) {
    return `HELP_FORM_${format(resource)}_FIELD_${format(field)}` as LabelKey;
  };
}

export function toTitleHint(resource: string) {
  return `HELP_${format(resource)}_TITLE` as LabelKey;
}

function format(part: string) {
  return _.snakeCase(part).toUpperCase();
}
