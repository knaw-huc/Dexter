import React from 'react';
import { grey } from '@mui/material/colors';
import _ from 'lodash';
import styled from '@emotion/styled';

type FieldMapper<T> = (resource: T, fieldName: keyof T) => string | undefined;

export const SummaryP = styled.p`
  line-height: 0.6em;
  margin-top: 1.5em;
`;

export type KeyLabel<T> = { key: keyof T; label?: string };

export function ShortFieldsSummary<T>(props: {
  fields: KeyLabel<T>[];
  resource: T;
  fieldMapper?: FieldMapper<T>;
}) {
  const fieldsToShow = props.fields.filter(
    field => !_.isEmpty(props.resource[field.key]),
  );
  return (
    <SummaryP>
      {fieldsToShow.map((field: KeyLabel<T>, i) => [
        i > 0 && <Spacer key={`spacer-${i}`} />,
        <ShortField<T>
          key={i}
          field={field}
          resource={props.resource}
          fieldMapper={props.fieldMapper}
        />,
      ])}
    </SummaryP>
  );
}

export function ShortField<T>(props: {
  field: KeyLabel<T>;
  resource: T;
  fieldMapper: FieldMapper<T>;
}) {
  const field = props.field;
  const label = String(field.label || field.key);

  let value: string;
  if (props.fieldMapper) {
    value = props.fieldMapper(props.resource, field.key);
  }
  if (!value) {
    value = String(props.resource[field.key]);
  }

  if (!value) {
    return null;
  }
  return (
    <span style={{ textTransform: 'capitalize' }}>
      <FieldLabel label={label} /> <strong>{value}</strong>
    </span>
  );
}

export function FieldLabel(props: { label: string }) {
  return <span style={{ color: grey[600] }}>{props.label}: </span>;
}

export function Spacer() {
  return (
    <span style={{ display: 'inline-block', color: 'grey', margin: '0.75em' }}>
      {' '}
      |{' '}
    </span>
  );
}
