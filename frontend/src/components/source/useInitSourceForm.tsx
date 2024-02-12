import { Dispatch, SetStateAction, useState } from 'react';
import {
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  Source,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';
import { FormErrors } from '../common/FormError';

type UseInitSourceFormResult = {
  init: () => void;
  isInit: boolean;
};

type UseInitSourceFormParams = {
  sourceToEdit?: Source;
  setForm: Dispatch<SetStateAction<Source>>;
  setErrors: Dispatch<SetStateAction<FormErrors<Source>>>;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
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

  // Not created or modified by form:
  id: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

export function useInitSourceForm(
  params: UseInitSourceFormParams,
): UseInitSourceFormResult {
  const { sourceToEdit, setForm, setErrors, setKeys, setValues } = params;
  const [isInit, setInit] = useState(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      const toEdit = sourceToEdit;
      setForm({ ...(toEdit ?? defaults) });
      setErrors({} as FormErrors<Corpus>);
      setKeys(await getMetadataKeys());
      if (toEdit) {
        setValues(toEdit.metadataValues.map(toFormMetadataValue));
      }
      setInit(true);
    }
  }

  return { init, isInit };
}
