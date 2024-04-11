import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  ResultMetadataKey,
  Source,
  SubmitFormSource,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { useImmer } from 'use-immer';
import { defaultSource } from './defaultSource';
import { useMetadata } from '../../state/resources/hooks/useMetadata';

export function useInitSourceForm(params: {
  sourceToEdit?: Source;
  setForm: Dispatch<SetStateAction<SubmitFormSource>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
}): {
  isInit: boolean;
} {
  const { sourceToEdit, setForm, setKeys } = params;
  const [isInit, setInit] = useImmer(false);
  const { getMetadataKeys } = useMetadata();

  useEffect(init, []);

  function init() {
    if (isInit) {
      return;
    }

    setForm(toSourceForm(sourceToEdit));
    setKeys(getMetadataKeys());
    setInit(true);
  }

  return { isInit };
}

function toSourceForm(toEdit?: Source): SubmitFormSource {
  return {
    ...(toEdit || defaultSource),
    metadataValues: toEdit?.metadataValues.map(toFormMetadataValue) || [],
  };
}
