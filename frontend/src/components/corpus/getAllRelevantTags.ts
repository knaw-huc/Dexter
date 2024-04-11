import _ from 'lodash';
import { ResultTag } from '../../model/Tag';

type WithTags = { tags: ResultTag[] };

/**
 * Get all tags from relevant resources and its children
 * See also: {@link isRelevantResource}
 */
export function getAllRelevantTags(
  resources: WithTags[],
  selected: ResultTag[],
): ResultTag[] {
  const relevantResources = resources.filter(r =>
    isRelevantResource(r, selected),
  );
  return _.uniqBy(relevantResources.map(s => s.tags).flat(), 'id');
}

/**
 * A resource is relevant when it contains all tags,
 * also taking into account the tags of children
 * (i.e. subcorpora and sources)
 */
export function isRelevantResource(resource: WithTags, selected: ResultTag[]) {
  return selected.every(tag => resource.tags.find(rt => tag.id === rt.id));
}
