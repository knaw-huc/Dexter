import React from 'react';
import { TagForm } from './TagForm';
import { TagList } from './TagList';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { TagIcon } from './tagIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { HintedTitle } from '../common/HintedTitle';
import { cancel } from '../../utils/cancel';
import { useTags } from '../../resources/useTags';
import { ResultTag } from '../../model/Tag';

export default function TagIndex() {
  const throwSync = useThrowSync();
  const { getTags, deleteTag } = useTags();
  const tags = getTags();

  async function handleDelete(toDelete: ResultTag) {
    if (cancel('Delete this tag?')) {
      return;
    }

    await deleteTag(toDelete.id).catch(e => throwSync(e));
  }

  if (!tags) {
    return null;
  }
  return (
    <>
      <HeaderBreadCrumb />
      <h1>
        <TagIcon />
        <HintedTitle title="Tags" hint="tagIndex" />
      </h1>
      <TagForm />
      <div style={{ marginTop: '1em' }}>
        <TagList tags={tags} onDelete={handleDelete} />
      </div>
    </>
  );
}
