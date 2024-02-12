import { deleteTagFromSource } from './API';
import { ResultTag } from '../model/DexterModel';

export const deleteTagFromSourceWithWarning = async (
  tag: ResultTag,
  sourceId: string,
) => {
  const warning = window.confirm('Are you sure you wish to delete this tag?');

  if (warning === false) return;

  await deleteTagFromSource(sourceId, tag.id);
};
