export type ConstraintToMsg = {
  name: string;
  path: RegExp;
  message: string;
};
export const dbConstraints: ConstraintToMsg[] = [
  {
    name: 'metadata_values_key_id_fkey',
    path: /\/api\/metadata\/keys\//,
    message:
      'Cannot delete this metadata field: it is still used by one or more sources or corpora',
  },
  {
    name: 'references_created_by_input_key',
    path: /\/api\/references/,
    message: 'This reference already exists',
  },
];

export function toConstraint(message: string, url: string) {
  return dbConstraints.find(c => {
    const constraintMatch = message.includes(c.name);
    const urlMatch = c.path?.test(url) || true;
    return constraintMatch && urlMatch;
  });
}
