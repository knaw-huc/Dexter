import { Dispatch, SetStateAction, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { defaultSource } from './defaultSource';
import { useMetadata } from '../../resources/useMetadata';
import { Source, SubmitFormSource } from '../../model/Source';
import { ResultMetadataKey, toFormMetadataValue } from '../../model/Metadata';

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
