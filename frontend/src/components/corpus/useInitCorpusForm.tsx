import { Dispatch, SetStateAction } from 'react';
import {
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { useImmer } from 'use-immer';
import { defaultCorpus } from './defaultCorpus';
import { useMetadata } from '../../state/resources/hooks/useMetadata';

type UseInitCorpusFormResult = {
  init: () => void;
  isInit: boolean;
};

export function useInitCorpusForm(params: {
  corpusToEdit?: Corpus;
  setForm: Dispatch<SetStateAction<Corpus>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
  parent?: Corpus;
}): UseInitCorpusFormResult {
  const { corpusToEdit, setForm, setKeys, setValues, parent } = params;
  const { getMetadataKeys } = useMetadata();

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
        parent,
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
