import React from 'react';
import { isImage, Source } from '../../model/DexterModel';
import { HeaderLinkClamped } from '../common/HeaderLinkClamped';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Grid } from '@mui/material';
import { PClamped } from '../common/PClamped';
import { TagList } from '../tag/TagList';
import { SourceIcon } from './SourceIcon';
import { Title } from '../media/Title';
import { CardHeaderImage } from '../common/CardHeaderImage';
import { sources } from '../../model/Resources';
import { TopRightCloseIcon } from '../common/icon/CloseIcon';

interface SourceItemDropdownProps {
  source: Source;
  onUnlink: () => void;
}

export const SourcePreview = (props: SourceItemDropdownProps) => {
  const navigate = useNavigate();

  const headerImage = props.source.media.find(m => isImage(m.mediaType))?.url;

  function navigateToSource() {
    return navigate(`/${sources}/${props.source.id}`);
  }

  return (
    <Card style={{ height: '100%' }}>
      <CardHeaderImage src={headerImage} onClick={navigateToSource} />
      <CardContent style={{ height: '100%', paddingBottom: '1em' }}>
        <Grid container>
          <Grid item sx={{ maxHeight: '110px' }} xs={12}>
            <TopRightCloseIcon
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                e.stopPropagation();
                props.onUnlink();
              }}
            />
            <HeaderLinkClamped onClick={navigateToSource}>
              <SourceIcon fontSize="small" />
              <Title title={props.source.title} />
            </HeaderLinkClamped>
            <PClamped>{props.source.description}</PClamped>
          </Grid>
          <Grid item>
            <TagList tags={props.source.tags} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
