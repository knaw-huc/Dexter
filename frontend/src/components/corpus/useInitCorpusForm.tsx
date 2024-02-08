import { Dispatch, SetStateAction, useState } from 'react';
import {
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';

type UseInitCorpusFormResult = {
  init: () => void;
  isInit: boolean;
};

type UseInitCorpusFormParams = {
  corpusToEdit?: Corpus;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
  setForm: Dispatch<SetStateAction<Corpus>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
};

const defaults: Corpus = {
  parent: undefined,
  title: '',
  description: undefined,
  rights: undefined,
  access: undefined,
  location: undefined,
  earliest: undefined,
  latest: undefined,
  contributor: undefined,
  notes: undefined,
  keywords: [],
  languages: [],
  sources: [],
  metadataValues: [],

  // Not created or modified by form:
  id: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

export function useInitCorpusForm(
  params: UseInitCorpusFormParams,
): UseInitCorpusFormResult {
  const { corpusToEdit, setValues, setForm, setKeys } = params;
  const [isInit, setInit] = useState(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      const toEdit = corpusToEdit;
      setKeys(await getMetadataKeys());
      setForm({ ...(toEdit ?? defaults) });
      if (toEdit?.metadataValues.length) {
        setValues(toEdit.metadataValues.map(toFormMetadataValue));
      }
      setInit(true);
    }
  }

  return { init, isInit };
}
