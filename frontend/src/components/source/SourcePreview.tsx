import React from 'react';
import { ResultKeyword, Source } from '../../model/DexterModel';
import { HeaderLinkClamped } from '../common/HeaderLinkClamped';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Grid } from '@mui/material';
import { PClamped } from '../common/PClamped';
import { KeywordList } from '../keyword/KeywordList';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SourceIcon } from './SourceIcon';
import { grey } from '@mui/material/colors';

interface SourceItemDropdownProps {
  source: Source;
  corpusId: string;
  onUnlinkSource: () => void;
}

export const SourcePreview = (props: SourceItemDropdownProps) => {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        height: '100%',
      }}
    >
      <CardContent
        style={{
          height: '100%',
          paddingBottom: '1em',
        }}
      >
        <Grid container>
          <Grid item sx={{ height: '110px' }} xs={12}>
            <CloseInlineIcon
              style={{ float: 'right', top: 0 }}
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                e.stopPropagation();
                props.onUnlinkSource();
              }}
            />
            <HeaderLinkClamped
              onClick={() => navigate(`/sources/${props.source.id}`)}
            >
              <SourceIcon fontSize="small" />
              {props.source.title}
            </HeaderLinkClamped>
            <PClamped>{props.source.description}</PClamped>
          </Grid>
          <Grid item>
            <KeywordList keywords={props.source.keywords} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
