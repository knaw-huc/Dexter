import { Dispatch, SetStateAction, useState } from 'react';
import isUrl from '../../utils/isUrl';
import { FormErrors, setFormErrors } from '../common/FormError';
import { ResultImport, Source } from '../../model/DexterModel';
import { postImport } from '../../utils/API';

type UseImportMetadataResult = {
  isImportLoading: boolean;
  loadImport: (form: Source) => Promise<Source>;
};

type UseImportMetadataParams = {
  setErrors: Dispatch<SetStateAction<FormErrors<Source>>>;
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
      await setFormErrors(e, params.setErrors);
    }
    if (!tmsImport?.isValidExternalReference) {
      params.setErrors(prev => ({
        ...prev,
        externalRef: { message: 'External reference could not be imported' },
      }));
      setImportLoading(false);
      return form;
    }

    const update: Source = { ...form };
    Object.keys(tmsImport.imported).forEach((key: keyof Source) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (update as any)[key] = tmsImport.imported[key];
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
