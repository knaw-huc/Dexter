import React, { useEffect, useState } from 'react';
import { ResultTag } from '../../model/DexterModel';
import { deleteTag, getTags } from '../../utils/API';
import { TagForm } from './TagForm';
import { TagList } from './TagList';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { TagIcon } from './tagIcon';
import { useThrowSync } from '../common/error/useThrowSync';

export const TagIndex = () => {
  const [tags, setTags] = useState<ResultTag[]>([]);
  const throwSync = useThrowSync();

  useEffect(() => {
    init();

    async function init() {
      setTags(await getTags());
    }
  }, []);

  async function handleDelete(toDelete: ResultTag) {
    const warning = window.confirm('Are you sure you wish to delete this tag?');

    if (warning === false) return;

    await deleteTag(toDelete.id).catch(e => throwSync(e));
    setTags(prev => prev.filter(t => t.id !== toDelete.id));
  }

  return (
    <>
      <HeaderBreadCrumb />
      <h1>
        <TagIcon />
        Tags
      </h1>
      <TagForm onSaved={newTag => setTags(t => [...t, newTag])} />
      <div style={{ marginTop: '1em' }}>
        <TagList tags={tags} onDelete={handleDelete} />
      </div>
    </>
  );
};
