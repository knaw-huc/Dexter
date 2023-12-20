import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React from "react";
import { Controller, UseFormSetValue, useWatch } from "react-hook-form";
import { ServerCorpus, ServerSource } from "../../model/DexterModel";
import { deleteSourceFromCorpus } from "../../utils/API";

interface PartOfSourceFieldProps {
  sources: ServerSource[];
  control: any;
  corpusId: string;
  setValue: UseFormSetValue<ServerCorpus>;
  edit: boolean;
}

export const PartOfSourceField = (props: PartOfSourceFieldProps) => {
  const { control } = props;
  const [inputValue, setInputValue] = React.useState("");
  const selectedItems = useWatch({ control, name: "sourceIds" });

  const deleteSourceFromSourceHandler = async (source: ServerSource) => {
    if (!props.edit) {
      props.setValue(
        "sourceIds",
        selectedItems.filter((entry: ServerSource) => entry !== source)
      );
      return;
    }

    await deleteSourceFromCorpus(props.corpusId, source.id);
    props.setValue(
      "sourceIds",
      selectedItems.filter((entry: ServerSource) => entry !== source)
    );
  };

  return (
    <div>
      {props.sources && (
        <Controller
          control={props.control}
          name={"sourceIds"}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              inputValue={inputValue}
              onInputChange={async (event, value) => {
                setInputValue(value);
              }}
              multiple={true}
              id="partofsource-autocomplete"
              options={props.sources}
              getOptionLabel={(source: ServerSource) => source.title}
              filterOptions={(x) => x}
              isOptionEqualToValue={(option, value) =>
                option.title === value.title
              }
              value={value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Search and select sources"
                  value={value}
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((source, index) => (
                  <Chip
                    label={source.title}
                    key={index}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      deleteSourceFromSourceHandler(source);
                    }}
                  />
                ))
              }
              onChange={(_, data) => {
                onChange(data);
              }}
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.title, inputValue, {
                  insideWords: true,
                });
                const parts = parse(option.title, matches);

                return (
                  <li {...props}>
                    <div>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              }}
            />
          )}
        />
      )}
    </div>
  );
};
