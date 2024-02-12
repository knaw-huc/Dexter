import { Dispatch, SetStateAction, useState } from 'react';
import {
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';
import { FormErrors } from '../common/FormErrorMessage';

type UseInitCorpusFormResult = {
  init: () => void;
  isInit: boolean;
};

type UseInitCorpusFormParams = {
  corpusToEdit?: Corpus;
  setForm: Dispatch<SetStateAction<Corpus>>;
  setErrors: Dispatch<SetStateAction<FormErrors<Corpus>>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
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
  tags: [],
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
  const { corpusToEdit, setForm, setErrors, setKeys, setValues } = params;
  const [isInit, setInit] = useState(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      const toEdit = corpusToEdit;
      setForm({ ...(toEdit ?? defaults) });
      setErrors({} as FormErrors<Corpus>);
      setKeys(await getMetadataKeys());
      if (toEdit?.metadataValues.length) {
        setValues(toEdit.metadataValues.map(toFormMetadataValue));
      }
      setInit(true);
    }
  }

  return { init, isInit };
}
