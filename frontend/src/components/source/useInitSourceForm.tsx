import { Dispatch, SetStateAction, useState } from 'react';
import {
  ResultMetadataKey,
  Source,
  SubmitFormSource,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';

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
  tags: [],
  languages: [],
  metadataValues: [],
  media: [],
  corpora: [],

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
  const [isInit, setInit] = useState(false);

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
