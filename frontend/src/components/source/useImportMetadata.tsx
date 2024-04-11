import isUrl from '../../utils/isUrl';
import { ResultImport, Source } from '../../model/DexterModel';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { Any } from '../common/Any';
import { useImmer } from 'use-immer';
import { reject } from '../../utils/reject';
import { useImport } from '../../resources/useImport';

type WithExternalRef = {
  externalRef?: string;
};

type UseImportMetadataResult<T extends WithExternalRef> = {
  isImportLoading: boolean;
  loadImport: (form: T) => Promise<T>;
};

type UseImportMetadataParams = {
  setError: (error: ErrorWithMessage) => Promise<void>;
  setFieldError: (field: keyof Source, error: ErrorWithMessage) => void;
};

export function useImportMetadata<T extends WithExternalRef>(
  params: UseImportMetadataParams,
): UseImportMetadataResult<T> {
  const { setError, setFieldError } = params;
  const [isImportLoading, setImportLoading] = useImmer(false);
  const { postImport } = useImport();

  function checkCanImporting(externalRef: string) {
    if (reject('Importing overwrites existing values. Continue?')) {
      return;
    }

    if (isImportLoading) {
      return false;
    }
    return isUrl(externalRef);
  }

  async function loadImport(form: T): Promise<T> {
    if (!checkCanImporting(form.externalRef)) {
      return;
    }
    setImportLoading(true);
    let tmsImport: ResultImport;
    try {
      tmsImport = await postImport(new URL(form.externalRef));
    } catch (e) {
      await setError(e);
    }
    if (!tmsImport?.isValidExternalReference) {
      setFieldError('externalRef', {
        message: 'External reference could not be imported',
      });
      setImportLoading(false);
      return form;
    }

    const update: T = { ...form };
    Object.keys(tmsImport.imported).forEach((key: keyof Source) => {
      (update as Any)[key] = tmsImport.imported[key];
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
