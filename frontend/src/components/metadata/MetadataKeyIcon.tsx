import React from 'react';
import {
  ResourceIconProps,
  styleResourceIcon,
} from '../../utils/styleResourceIcon';
import MoreIcon from '@mui/icons-material/More';

const MoreIconStyled = styleResourceIcon(MoreIcon);

export function MetadataKeyIcon(props: ResourceIconProps) {
  const iconProps = {
    ...props,
    fontSize: props.fontSize ? props.fontSize : 'inherit',
  };
  return <MoreIconStyled {...iconProps} />;
}
