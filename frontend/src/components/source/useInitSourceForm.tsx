import { Dispatch, SetStateAction } from 'react';
import {
  ResultMetadataKey,
  Source,
  SubmitFormSource,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';
import { useImmer } from 'use-immer';

type UseInitSourceFormResult = {
  init: () => void;
  isInit: boolean;
};

type UseInitSourceFormParams = {
  sourceToEdit?: Source;
  setForm: Dispatch<SetStateAction<SubmitFormSource>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
};

const defaults: Source = {
  title: '',
  description: undefined,
  rights: undefined,
  access: undefined,
  location: undefined,
  earliest: undefined,
  latest: undefined,
  notes: undefined,

  references: [],
  corpora: [],
  languages: [],
  media: [],
  metadataValues: [],
  tags: [],

  // Not created or modified by form:
  id: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

function toSourceForm(toEdit?: Source): SubmitFormSource {
  return {
    ...(toEdit || defaults),
    metadataValues: toEdit?.metadataValues.map(toFormMetadataValue) || [],
  };
}

export function useInitSourceForm(
  params: UseInitSourceFormParams,
): UseInitSourceFormResult {
  const { sourceToEdit, setForm, setKeys } = params;
  const [isInit, setInit] = useImmer(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      setForm(toSourceForm(sourceToEdit));
      setKeys(await getMetadataKeys());
      setInit(true);
    }
  }

  return { init, isInit };
}
