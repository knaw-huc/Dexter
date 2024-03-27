import { Dispatch, SetStateAction } from 'react';
import {
  ResultMetadataKey,
  Source,
  SubmitFormSource,
  toFormMetadataValue,
} from '../../model/DexterModel';
import { getMetadataKeys } from '../../utils/API';
import { useImmer } from 'use-immer';
import { defaultSource } from './defaultSource';

type UseInitSourceFormResult = {
  init: () => void;
  isInit: boolean;
};

type UseInitSourceFormParams = {
  sourceToEdit?: Source;
  setForm: Dispatch<SetStateAction<SubmitFormSource>>;
  setKeys: Dispatch<ResultMetadataKey[]>;
};

function toSourceForm(toEdit?: Source): SubmitFormSource {
  return {
    ...(toEdit || defaultSource),
    metadataValues: toEdit?.metadataValues.map(toFormMetadataValue) || [],
  };
}

export function useInitSourceForm(
  params: UseInitSourceFormParams,
): UseInitSourceFormResult {
  const { sourceToEdit, setForm, setKeys } = params;
  const [isInit, setInit] = useImmer(false);

  function init() {
    runOnce();

    async function runOnce() {
      if (isInit) {
        return;
      }

      setForm(toSourceForm(sourceToEdit));
      setKeys(await getMetadataKeys());
      setInit(true);
    }
  }

  return { init, isInit };
}
