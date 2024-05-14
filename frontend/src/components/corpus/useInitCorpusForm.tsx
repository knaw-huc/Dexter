import { Dispatch, SetStateAction, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { defaultCorpus } from './defaultCorpus';
import { useMetadata } from '../../resources/useMetadata';
import { Corpus } from '../../model/Corpus';
import {
  FormMetadataValue,
  ResultMetadataKey,
  toFormMetadataValue,
} from '../../model/Metadata';

export function useInitCorpusForm(params: {
  corpusToEdit?: Corpus;
  setForm: Dispatch<SetStateAction<Corpus>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
  setValues: Dispatch<SetStateAction<FormMetadataValue[]>>;
  fixedParent?: Corpus;
}): {
  isInit: boolean;
} {
  const { corpusToEdit, setForm, setKeys, setValues, fixedParent } = params;
  const { getMetadataKeys } = useMetadata();

  const [isInit, setInit] = useImmer(false);

  useEffect(init, []);

  function init() {
    if (isInit) {
      return;
    }

    const toEdit = corpusToEdit;
    setForm({
      ...(toEdit || defaultCorpus),
      parent: fixedParent || toEdit?.parent,
    });
    setKeys(getMetadataKeys());
    if (toEdit?.metadataValues.length) {
      setValues(toEdit.metadataValues.map(toFormMetadataValue));
    }
    setInit(true);
  }

  return { isInit };
}
