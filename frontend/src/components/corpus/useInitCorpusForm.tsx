import { Dispatch, SetStateAction } from 'react';
import {
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';
import { useImmer } from 'use-immer';
import { defaultCorpus } from './defaultCorpus';

type UseInitCorpusFormResult = {
  init: () => void;
  isInit: boolean;
};

type UseInitCorpusFormParams = {
  corpusToEdit?: Corpus;
  setForm: Dispatch<SetStateAction<Corpus>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
};

export function useInitCorpusForm(
  params: UseInitCorpusFormParams,
): UseInitCorpusFormResult {
  const { corpusToEdit, setForm, setKeys, setValues } = params;
  const [isInit, setInit] = useImmer(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      const toEdit = corpusToEdit;
      setForm({ ...(toEdit ?? defaultCorpus) });
      setKeys(await getMetadataKeys());
      if (toEdit?.metadataValues.length) {
        setValues(toEdit.metadataValues.map(toFormMetadataValue));
      }
      setInit(true);
    }
  }

  return { init, isInit };
}
