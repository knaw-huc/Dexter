import { BreadCrumbLink } from '../common/breadcrumb/BreadCrumbLink';
import React from 'react';
import { corpora } from '../../model/Resources';

export function CorporaBreadCrumbLink() {
  return <BreadCrumbLink to={`/${corpora}`}>Corpora</BreadCrumbLink>;
}
