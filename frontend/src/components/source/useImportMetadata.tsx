import { Dispatch, SetStateAction, useState } from 'react';
import isUrl from '../../utils/isUrl';
import {
  ErrorByField,
  setFormFieldErrors,
  upsertFieldError,
} from '../common/FormErrorMessage';
import { ResultImport, Source } from '../../model/DexterModel';
import { postImport } from '../../utils/API';

type UseImportMetadataResult = {
  isImportLoading: boolean;
  loadImport: (form: Source) => Promise<Source>;
};

type UseImportMetadataParams = {
  setErrors: Dispatch<SetStateAction<ErrorByField<Source>[]>>;
};

export function useImportMetadata(
  params: UseImportMetadataParams,
): UseImportMetadataResult {
  const [isImportLoading, setImportLoading] = useState(false);

  function checkCanImporting(externalRef: string) {
    const warning = window.confirm(
      'Importing overwrites existing values. Are you sure you want to import?',
    );

    if (warning === false) {
      return false;
    }
    if (isImportLoading) {
      return false;
    }
    return isUrl(externalRef);
  }

  async function loadImport(form: Source): Promise<Source> {
    if (!checkCanImporting(form.externalRef)) {
      return;
    }
    setImportLoading(true);
    let tmsImport: ResultImport;
    try {
      tmsImport = await postImport(new URL(form.externalRef));
    } catch (e) {
      await setFormFieldErrors(e, params.setErrors);
    }
    if (!tmsImport || !tmsImport.isValidExternalReference) {
      params.setErrors(prev =>
        upsertFieldError(
          prev,
          new ErrorByField('externalRef', 'Is not a valid external reference'),
        ),
      );
    }
    const update: Source = { ...form };

    Object.keys(update).forEach((key: keyof Source) => {
      if (tmsImport.imported[key]) {
        if (typeof update[key] === 'string') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (update as any)[key] = tmsImport.imported[key];
        }
      }
    });
    setImportLoading(false);
    return update;
  }

  return {
    isImportLoading,
    loadImport,
  };
}

export function isImportableUrl(externalRef?: string): boolean {
  return IMPORTABLE_URL.test(externalRef);
}

const IMPORTABLE_URL = new RegExp(
  'https://hdl\\.handle\\.net/[0-9.]*/([0-9]*)',
);
