import { ResultImport } from '../model/DexterModel';
import { postValidated } from '../utils/API';

export function useImport() {
  const postImport = async (url: URL): Promise<ResultImport> => {
    return postValidated(`/api/import/wereldculturen`, { url });
  };

  return {
    postImport,
  };
}
