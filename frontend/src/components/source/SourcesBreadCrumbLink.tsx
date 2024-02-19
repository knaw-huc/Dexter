import { BreadCrumbLink } from '../common/breadcrumb/BreadCrumbLink';
import React from 'react';
import { sources } from '../../model/Resources';

export function SourcesBreadCrumbLink() {
  return <BreadCrumbLink to={`/${sources}`}>Sources</BreadCrumbLink>;
}
