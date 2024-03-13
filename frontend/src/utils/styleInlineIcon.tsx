import { FC } from 'react';
import styled from '@emotion/styled';
import { Any } from '../components/common/Any';

export const styleInlineIcon = (component: FC<{ [x: string]: Any }>) => styled(
  component,
)`
  vertical-align: bottom;
`;
