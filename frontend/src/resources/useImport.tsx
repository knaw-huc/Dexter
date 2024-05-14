import { postValidated } from '../utils/API';
import { ResultImport } from '../model/Import';

export function useImport() {
  const postImport = async (url: URL): Promise<ResultImport> => {
    return postValidated(`/api/import/wereldculturen`, { url });
  };

  return {
    postImport,
  };
}
