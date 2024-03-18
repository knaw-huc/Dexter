import React from 'react';
import { MetadataValue } from '../../model/DexterModel';
import { Label } from '../common/Label';
import styled from '@emotion/styled';
import { H2Styled } from '../common/H2Styled';
import _ from 'lodash';

type MetadataValuePageFieldsProps = {
  values: MetadataValue[];
};

const MetadataValueStyled = styled.p`
  margin-top: 0;
`;

export function MetadataValuePageFields(props: MetadataValuePageFieldsProps) {
  return (
    <>
      <H2Styled>Custom Metadata</H2Styled>
      {_.sortBy(props.values, ['key.id']).map((value: MetadataValue, i) => (
        <div key={i}>
          <Label>{value.key.key}</Label>
          <MetadataValueStyled>{value.value}</MetadataValueStyled>
        </div>
      ))}
    </>
  );
}
