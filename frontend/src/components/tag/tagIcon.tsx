import React from 'react';
import {
  ResourceIconProps,
  styleResourceIcon,
} from '../../utils/styleResourceIcon';

import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
const SellOutlinedIconStyled = styleResourceIcon(SellOutlinedIcon);

export function TagIcon(props: ResourceIconProps) {
  return <SellOutlinedIconStyled {...props} />;
}
