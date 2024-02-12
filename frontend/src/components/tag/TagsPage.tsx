import React, { useState } from 'react';
import { ResultTag } from '../../model/DexterModel';
import { deleteTag, getTags } from '../../utils/API';
import { TagForm } from './TagForm';
import { TagList } from './TagList';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';

export const TagsPage = () => {
  const [tags, setTags] = useState<ResultTag[]>([]);

  React.useEffect(() => {
    doGetTags();
  }, []);

  const doGetTags = async () => {
    const kw = await getTags();
    setTags(kw);
  };

  const handleDelete = (tag: ResultTag) => {
    const warning = window.confirm('Are you sure you wish to delete this tag?');

    if (warning === false) return;

    deleteTag(tag.id).then(() => doGetTags());
  };

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
