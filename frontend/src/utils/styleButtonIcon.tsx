import { FC } from 'react';
import styled from '@emotion/styled';
import { AnyProp } from '../components/common/Any';

export const styleButtonIcon = (component: FC<AnyProp>) => styled(component)`
  margin-top: -0.15em;
  margin-right: 0.4em;
`;
