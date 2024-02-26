import React from 'react';
import { MetadataValue } from '../../model/DexterModel';
import { Label } from '../common/Label';
import styled from '@emotion/styled';
import { compareMetadataValues } from '../../utils/compareMetadataValues';
import { H2Styled } from '../common/H2Styled';

type MetadataValuePageFieldsProps = {
  values: MetadataValue[];
};

const MetadataValue = styled.p`
  margin-top: 0;
`;

export function MetadataValuePageFields(props: MetadataValuePageFieldsProps) {
  return (
    <>
      <H2Styled>Custom Metadata</H2Styled>
      {props.values.sort(compareMetadataValues).map((value, i) => (
        <div key={i}>
          <Label>{value.key.key}</Label>
          <MetadataValue>{value.value}</MetadataValue>
        </div>
      ))}
    </>
  );
}
