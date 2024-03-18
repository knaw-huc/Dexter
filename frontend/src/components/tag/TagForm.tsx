import TextField from '@mui/material/TextField';
import React from 'react';
import { FormTag, ResultTag } from '../../model/DexterModel';
import { createTag } from '../../utils/API';
import { Button, Grid } from '@mui/material';
import * as yup from 'yup';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { FieldError } from '../common/error/FieldError';
import { useImmer } from 'use-immer';

type NewTagsProps = {
  onSaved: (newTag: ResultTag) => void;
};

const tagSchema = yup.object({
  val: yup.string().required('Tag cannot be empty'),
});
export function TagForm(props: NewTagsProps) {
  const [form, setForm] = useImmer<FormTag>({ val: '' });
  const { errors, setError } = useFormErrors<FormTag>();

  async function handleCreateTag() {
    try {
      await tagSchema.validate(form);
      const newTag = await createTag(form);
      setForm(f => ({ ...f, val: '' }));
      props.onSaved(newTag);
    } catch (error) {
      await setError(error);
    }
  }

  return (
    <div>
      <FormErrorMessage error={errors.generic} />
      <FieldError error={errors.val} />
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
