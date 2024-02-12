import TextField from '@mui/material/TextField';
import React, { useContext, useState } from 'react';
import { ResultTag } from '../../model/DexterModel';
import { createTag, getTags } from '../../utils/API';
import { errorContext } from '../../state/error/errorContext';
import { Button, Grid } from '@mui/material';

type NewTagsProps = {
  setTags: React.Dispatch<React.SetStateAction<ResultTag[]>>;
};

export function TagForm(props: NewTagsProps) {
  const { dispatchError } = useContext(errorContext);
  const [tag, setTag] = useState('');

  async function handleCreateTag() {
    try {
      await createTag({ val: tag });
      const all = await getTags();
      props.setTags(all);
      setTag('');
    } catch (error) {
      dispatchError(error);
    }
  }

  return (
    <div>
      <h1>Tags</h1>
      <Grid container>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="Add tag..."
            value={tag}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateTag();
              }
            }}
            onChange={e => setTag(e.currentTarget.value)}
            autoFocus
          />
        </Grid>
        <Grid item alignItems="stretch" style={{ display: 'flex' }}>
          <Button
            onClick={handleCreateTag}
            sx={{ ml: '0.5em' }}
            variant="contained"
          >
            Create ⏎
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
