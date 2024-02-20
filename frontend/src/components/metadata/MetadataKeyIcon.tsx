import React from 'react';
import {
  ResourceIconProps,
  styleResourceIcon,
} from '../../utils/styleResourceIcon';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';

const PlaylistAddOutlinedIconStyled = styleResourceIcon(
  PlaylistAddOutlinedIcon,
);

export function MetadataKeyIcon(props: ResourceIconProps) {
  const iconProps = {
    ...props,
    fontSize: props.fontSize ? props.fontSize : 'inherit',
  };
  return <PlaylistAddOutlinedIconStyled {...iconProps} />;
}
