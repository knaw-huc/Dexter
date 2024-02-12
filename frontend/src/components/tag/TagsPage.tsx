import React, { useState } from 'react';
import { ResultKeyword } from '../../model/DexterModel';
import { deleteKeyword, getKeywords } from '../../utils/API';
import { TagForm } from './TagForm';
import { TagList } from './TagList';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';

export const TagsPage = () => {
  const [keywords, setKeywords] = useState<ResultKeyword[]>([]);

  React.useEffect(() => {
    doGetKeywords();
  }, []);

  const doGetKeywords = async () => {
    const kw = await getKeywords();
    setKeywords(kw);
  };

  const handleDelete = (keyword: ResultKeyword) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this keyword?',
    );

    if (warning === false) return;

    deleteKeyword(keyword.id).then(() => doGetKeywords());
  };

  return (
    <>
      <HeaderBreadCrumb />

      <TagForm setKeywords={setKeywords} />
      <div style={{ marginTop: '1em' }}>
        <TagList keywords={keywords} onDelete={handleDelete} />
      </div>
    </>
  );
};
