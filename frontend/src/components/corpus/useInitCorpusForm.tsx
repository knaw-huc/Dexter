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

export function useInitCorpusForm(params: {
  corpusToEdit?: Corpus;
  setForm: Dispatch<SetStateAction<Corpus>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
  fixedParent?: Corpus;
}): UseInitCorpusFormResult {
  const { corpusToEdit, setForm, setKeys, setValues, fixedParent } = params;
  const [isInit, setInit] = useImmer(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      const toEdit = corpusToEdit;
      setForm({
        ...(toEdit || defaultCorpus),
        parent: fixedParent || toEdit?.parent,
      });
      setKeys(await getMetadataKeys());
      if (toEdit?.metadataValues.length) {
        setValues(toEdit.metadataValues.map(toFormMetadataValue));
      }
      setInit(true);
    }
  }

  return { init, isInit };
}
