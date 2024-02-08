import { Dispatch, SetStateAction, useState } from 'react';
import {
  FormMetadataValue,
  ResultMetadataKey,
  Source,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';

type UseInitSourceFormResult = {
  init: () => void;
  isInit: boolean;
};

type UseInitSourceFormParams = {
  sourceToEdit?: Source;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
  setForm: Dispatch<SetStateAction<Source>>;
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
  keywords: [],
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
  const { sourceToEdit, setValues, setForm, setKeys } = params;
  const [isInit, setInit] = useState(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      setKeys(await getMetadataKeys());

      const toEdit = sourceToEdit;
      if (toEdit) {
        setForm({ ...(toEdit ?? defaults) });
        const formValues = toEdit.metadataValues.map(toFormMetadataValue);
        setValues(formValues);
      }
      setInit(true);
    }
  }

  return { init, isInit };
}
