import React from 'react';
import { grey } from '@mui/material/colors';
import _ from 'lodash';
import styled from '@emotion/styled';
type FieldMapper<T> = (resource: T, fieldName: keyof T) => string | undefined;

export const SummaryP = styled.p`
  line-height: 0.6em;
  margin-top: 1.5em;
`;

export function ShortFieldsSummary<T>(props: {
  fieldNames: (keyof T)[];
  resource: T;
  fieldMapper?: FieldMapper<T>;
}) {
  const fieldsToShow = props.fieldNames.filter(
    name => !_.isEmpty(props.resource[name]),
  );
  return (
    <SummaryP>
      {fieldsToShow.map((field: keyof T, i) => [
        i > 0 && <Spacer key={`spacer-${i}`} />,
        <ShortField<T>
          key={i}
          fieldName={field}
          resource={props.resource}
          fieldMapper={props.fieldMapper}
        />,
      ])}
    </SummaryP>
  );
}

export function ShortField<T>(props: {
  fieldName: keyof T;
  resource: T;
  fieldMapper: FieldMapper<T>;
}) {
  const label = String(props.fieldName);

  let value: string;

  if (props.fieldMapper) {
    value = props.fieldMapper(props.resource, props.fieldName);
  }
  if (!value) {
    value = String(props.resource[props.fieldName]);
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
