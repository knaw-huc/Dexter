import React, { useState } from 'react';
import { ResultTag } from '../../model/DexterModel';
import { deleteTag, getTags } from '../../utils/API';
import { TagForm } from './TagForm';
import { TagList } from './TagList';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';

export const TagsPage = () => {
  const [tags, setTags] = useState<ResultTag[]>([]);

  React.useEffect(() => {
    init();

    async function init() {
      setTags(await getTags());
    }
  }, []);

  async function handleDelete(toDelete: ResultTag) {
    const warning = window.confirm('Are you sure you wish to delete this tag?');

    if (warning === false) return;

    await deleteTag(toDelete.id);
    setTags(prev => prev.filter(t => t.id !== toDelete.id));
  }

  return (
    <>
      <HeaderBreadCrumb />

      <TagForm setTags={setTags} />
      <div style={{ marginTop: '1em' }}>
        <TagList tags={tags} onDelete={handleDelete} />
      </div>
    </>
  );
};
