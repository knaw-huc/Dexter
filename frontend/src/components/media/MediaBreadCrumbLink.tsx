import { BreadCrumbLink } from '../common/breadcrumb/BreadCrumbLink';
import React from 'react';
import { media } from '../../model/Resources';

export function MediaBreadCrumbLink() {
  return <BreadCrumbLink to={`/${media}`}>Media</BreadCrumbLink>;
}
