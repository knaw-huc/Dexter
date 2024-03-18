import React from 'react';
import { Corpus, isImage } from '../../model/DexterModel';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Grid } from '@mui/material';
import { HeaderLinkClamped } from '../common/HeaderLinkClamped';
import { PClamped } from '../common/PClamped';
import { CorpusIcon } from './CorpusIcon';
import { Title } from '../media/Title';
import { CardHeaderImage } from '../common/CardHeaderImage';
import { TagList } from '../tag/TagList';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { corpora } from '../../model/Resources';

type CorpusPreviewProps = {
  corpus: Corpus;
  onUnlink?: () => void;
};

export function CorpusPreview(props: CorpusPreviewProps) {
  const navigate = useNavigate();

  const headerImage = props.corpus.sources
    .flatMap(s => s.media)
    .find(s => isImage(s.mediaType))?.url;

  const corpus = props.corpus;
  function navigateToCorpus() {
    return navigate(`/${corpora}/${corpus.id}`);
  }

  return (
    <Card style={{ height: '100%' }}>
      <CardHeaderImage src={headerImage} onClick={navigateToCorpus} />
      <CardContent style={{ height: '100%', paddingBottom: '1em' }}>
        <Grid container>
          <Grid item sx={{ maxHeight: '110px' }} xs={12}>
            {props.onUnlink && <CloseInlineIcon onClick={props.onUnlink} />}
            <HeaderLinkClamped onClick={navigateToCorpus}>
              <CorpusIcon />
              <Title title={corpus.title} />
            </HeaderLinkClamped>
            <PClamped>{corpus.description}</PClamped>
          </Grid>
          <Grid item sx={{ mt: '0.5em' }}>
            <TagList tags={props.corpus.tags} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
