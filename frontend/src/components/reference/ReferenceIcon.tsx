import React from 'react';
import {
  ResourceIconProps,
  styleResourceIcon,
} from '../../utils/styleResourceIcon';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const FormatQuoteIconStyled = styleResourceIcon(FormatQuoteIcon);

export function ReferenceIcon(props: ResourceIconProps) {
  return <FormatQuoteIconStyled fontSize="large" {...props} />;
}
