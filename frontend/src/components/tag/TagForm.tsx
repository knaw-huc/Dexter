import TextField from '@mui/material/TextField';
import React from 'react';
import { FormTag } from '../../model/DexterModel';
import { Button, Grid } from '@mui/material';
import * as yup from 'yup';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { FieldError } from '../common/error/FieldError';
import { useImmer } from 'use-immer';
import { useTags } from '../../resources/useTags';

const tagSchema = yup.object({
  val: yup.string().required('Tag cannot be empty'),
});
export function TagForm() {
  const [form, setForm] = useImmer<FormTag>({ val: '' });
  const { errors, setError } = useFormErrors<FormTag>();
  const { createTag } = useTags();

  async function handleCreateTag() {
    try {
      await tagSchema.validate(form);
      await createTag(form);
      setForm(f => ({ ...f, val: '' }));
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
            placeholder="Add tag..."
            variant="outlined"
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
