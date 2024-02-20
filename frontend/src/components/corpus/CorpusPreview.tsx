import React, { useContext } from 'react';
import { Corpus } from '../../model/DexterModel';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import { deleteCollection } from '../../utils/API';
import { errorContext } from '../../state/error/errorContext';
import { Card, CardContent } from '@mui/material';
import { HeaderLinkClamped } from '../common/HeaderLinkClamped';
import { PClamped } from '../common/PClamped';
import { CorpusIcon } from './CorpusIcon';
import { Title } from '../media/Title';

type CorpusPreviewProps = {
  corpus: Corpus;
  onDelete: () => void;
};

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;

  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;

export function CorpusPreview(props: CorpusPreviewProps) {
  const { dispatchError } = useContext(errorContext);
  const navigate = useNavigate();
  const handleDelete = async (collection: Corpus) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this corpus?',
    );

    if (warning === false) return;

    await deleteCollection(collection.id).catch(dispatchError);
    props.onDelete();
  };

  const corpus = props.corpus;
  return (
    <Card style={{ height: '100%' }}>
      <CardContent style={{ height: '100%' }}>
        <DeleteIconStyled
          style={{ float: 'right' }}
          onClick={() => handleDelete(corpus)}
        />
        <HeaderLinkClamped onClick={() => navigate(`/corpora/${corpus.id}`)}>
          <CorpusIcon />
          <Title title={corpus.title} />
        </HeaderLinkClamped>
        <PClamped>{corpus.description}</PClamped>
      </CardContent>
    </Card>
  );
}
