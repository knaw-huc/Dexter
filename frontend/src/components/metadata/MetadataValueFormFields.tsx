import React, { ChangeEvent } from 'react';
import { FormMetadataValue, ResultMetadataKey } from '../../model/DexterModel';
import { Button, FormControl, Select } from '@mui/material';
import { Label } from '../common/Label';
import { SplitRow } from '../common/SplitRow';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DeleteIcon } from '../common/icon/DeleteIcon';
import _ from 'lodash';
import { FormFieldprops } from '../common/FormFieldProps';
import { FieldError } from '../common/error/FieldError';
import { useImmer } from 'use-immer';

type MetadataValueFormFieldsProps = FormFieldprops & {
  keys: ResultMetadataKey[];
  values: FormMetadataValue[];
  onChange: (values: FormMetadataValue[]) => void;
};

const NONE_SELECTED = 'none-selected';

export function MetadataValueFormFields(props: MetadataValueFormFieldsProps) {
  const [selectedKeyId, setSelectedKeyId] = useImmer(NONE_SELECTED);

  async function handleCreateField() {
    const newValue = {
      keyId: selectedKeyId,
      value: '',
    };
    const update = [...props.values, newValue];
    setSelectedKeyId(NONE_SELECTED);
    props.onChange(update);
  }

  async function handleDelete(toDelete: FormMetadataValue) {
    const warning = window.confirm(
      'Are you sure you want to delete this metadata field?',
    );

    if (warning === false) return;

    const update = props.values.filter(v => v.keyId !== toDelete.keyId);
    props.onChange(update);
  }

  function handleChangeFormValue(
    changed: FormMetadataValue,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const update = props.values?.map(fv =>
      fv.keyId === changed.keyId
        ? {
            keyId: changed.keyId,
            value: event.target.value,
          }
        : fv,
    );
    props.onChange(update);
  }

  const createMetadataKeyMsg =
    'Custom metadata fields can be created at /metadata';
  const selectMetadataKeyMsg = 'Select a custom metadata field';
  return (
    <>
      <FormControl fullWidth>
        {props.label && <Label>{props.label}</Label>}
        <FieldError error={props.error} />
        <SplitRow
          left={
            <Select
              labelId="metadata-field-select-label"
              fullWidth
              value={selectedKeyId}
              onChange={e => setSelectedKeyId(e.target.value)}
            >
              <MenuItem value={NONE_SELECTED}>
                {_.isEmpty(props.keys)
                  ? createMetadataKeyMsg
                  : selectMetadataKeyMsg}
              </MenuItem>
              {props.keys
                .filter(k => !props.values.find(v => v.keyId === k.id))
                .map((k, i) => (
                  <MenuItem key={i} value={k.id}>
                    {k.key}
                  </MenuItem>
                ))}
            </Select>
          }
          right={
            <Button
              disabled={selectedKeyId === NONE_SELECTED}
              fullWidth
              variant="contained"
              onClick={handleCreateField}
            >
              Add
            </Button>
          }
        />
        {_.sortBy(props.values, ['keyId']).map((value, i) => (
          <div key={i}>
            <Label>{props.keys.find(k => k.id === value.keyId).key}</Label>
            <TextField
              fullWidth
              variant="outlined"
              value={value.value}
              onChange={e => handleChangeFormValue(value, e)}
              InputProps={{
                endAdornment: (
                  <DeleteIcon onClick={() => handleDelete(value)} />
                ),
              }}
            />
          </div>
        ))}
      </FormControl>
    </>
  );
}
