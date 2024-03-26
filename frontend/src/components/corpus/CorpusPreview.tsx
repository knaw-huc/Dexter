import React from 'react';
import { Corpus, isImage } from '../../model/DexterModel';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Grid, Tooltip } from '@mui/material';
import { HeaderLinkClamped } from '../common/HeaderLinkClamped';
import { PClamped } from '../common/PClamped';
import { CorpusIcon } from './CorpusIcon';
import { Title } from '../media/Title';
import { CardHeaderImage } from '../common/CardHeaderImage';
import { TagList } from '../tag/TagList';
import { corpora } from '../../model/Resources';
import { getCorpusTags } from './getCorpusTags';
import _ from 'lodash';
import { hasEqualId } from '../../utils/hasEqualId';
import styled from '@emotion/styled';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import { TopRightCloseIcon } from '../common/icon/CloseIcon';

type CorpusPreviewProps = {
  corpus: Corpus;
  onUnlink?: () => void;
};

const NestedIconStyled = styled(ScatterPlotIcon)`
  font-size: 1em;
  position: absolute;
  margin-top: 0.7em;
  margin-left: 0.35em;
`;
export function CorpusPreview(props: CorpusPreviewProps) {
  const navigate = useNavigate();

  const headerImage = props.corpus.sources
    .flatMap(s => s.media)
    .find(s => isImage(s.mediaType))?.url;

  const corpus = props.corpus;
  function navigateToCorpus() {
    return navigate(`/${corpora}/${corpus.id}`);
  }

  const corpusTags = props.corpus.tags;
  const childTags = getCorpusTags(props.corpus);
  const uniqueChildTags = _.differenceWith(childTags, corpusTags, hasEqualId);

  return (
    <Card style={{ height: '100%' }}>
      <CardHeaderImage src={headerImage} onClick={navigateToCorpus} />
      <CardContent style={{ height: '100%', paddingBottom: '1em' }}>
        <Grid container>
          <Grid item sx={{ maxHeight: '130px' }} xs={12}>
            {props.onUnlink && <TopRightCloseIcon onClick={props.onUnlink} />}
            <HeaderLinkClamped onClick={navigateToCorpus}>
              <CorpusIcon />
              <Title title={corpus.title} />
            </HeaderLinkClamped>
            <PClamped>{corpus.description}</PClamped>
          </Grid>
          <Grid item sx={{ mt: '0.5em' }}>
            <TagList tags={corpusTags} />
            <TagList
              tags={uniqueChildTags}
              sx={{ opacity: '0.5' }}
              renderLabel={tag => (
                <span style={{ marginRight: '1.25em' }}>
                  {tag.val}
                  <Tooltip title="Tags from subcorpora and sources">
                    <NestedIconStyled />
                  </Tooltip>
                </span>
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
