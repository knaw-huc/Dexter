import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { FormTag, ResultTag } from '../../model/DexterModel';
import { createTag } from '../../utils/API';
import { Button, Grid } from '@mui/material';
import { useFormErrors } from '../common/useFormErrors';
import * as yup from 'yup';
import { FormErrorMessage } from '../common/FormError';
import { ErrorMessage } from '../common/ErrorMessage';

type NewTagsProps = {
  onSaved: (newTag: ResultTag) => void;
};

const tagSchema = yup.object({
  val: yup.string().required('Tag cannot be empty'),
});
export function TagForm(props: NewTagsProps) {
  const [form, setForm] = useState<FormTag>({ val: '' });
  const { errors, setError } = useFormErrors<FormTag>();

  async function handleCreateTag() {
    try {
      await tagSchema.validate(form);
      const newTag = await createTag(form);
      props.onSaved(newTag);
    } catch (error) {
      await setError(error);
    }
  }

  return (
    <div>
      <FormErrorMessage error={errors.generic} />
      <ErrorMessage error={errors.val} />
      <Grid container>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="Add tag..."
            value={form.val}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateTag();
              }
            }}
            onChange={event =>
              setForm(f => ({ ...f, val: event.target.value }))
            }
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
