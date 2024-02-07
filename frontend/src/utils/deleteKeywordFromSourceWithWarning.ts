import { deleteKeywordFromSource } from './API';
import { ResultKeyword } from '../model/DexterModel';

export const deleteKeywordFromSourceWithWarning = async (
  keyword: ResultKeyword,
  sourceId: string,
) => {
  const warning = window.confirm(
    'Are you sure you wish to delete this keyword?',
  );

  if (warning === false) return;

  await deleteKeywordFromSource(sourceId, keyword.id);
};
