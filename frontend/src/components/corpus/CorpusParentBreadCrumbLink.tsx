import { BreadCrumbLink } from '../common/breadcrumb/BreadCrumbLink';
import React from 'react';
import { CorpusIcon } from './CorpusIcon';

import { ResultCorpus } from '../../model/Corpus';

export function CorpusParentBreadCrumbLink(props: { parent: ResultCorpus }) {
  return (
    <BreadCrumbLink to={`/corpora/${props.parent.id}`}>
      <CorpusIcon />
      {props.parent.title}
    </BreadCrumbLink>
  );
}
