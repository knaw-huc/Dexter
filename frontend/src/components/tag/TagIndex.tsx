import React, { useEffect } from 'react';
import { ResultTag } from '../../model/DexterModel';
import { deleteTag, getTags } from '../../utils/API';
import { TagForm } from './TagForm';
import { TagList } from './TagList';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { TagIcon } from './tagIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { HintedTitle } from '../common/HintedTitle';
import { reject } from '../../utils/reject';

export const TagIndex = () => {
  const [tags, setTags] = useImmer<ResultTag[]>([]);
  const throwSync = useThrowSync();

  useEffect(() => {
    getTags().then(setTags).catch(throwSync);
  }, []);

  async function handleDelete(toDelete: ResultTag) {
    if (reject('Delete this tag?')) {
      return;
    }

    await deleteTag(toDelete.id).catch(e => throwSync(e));
    setTags(prev => prev.filter(t => t.id !== toDelete.id));
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
      <TagForm onSaved={newTag => setTags(t => [...t, newTag])} />
      <div style={{ marginTop: '1em' }}>
        <TagList tags={tags} onDelete={handleDelete} />
      </div>
    </>
  );
};
