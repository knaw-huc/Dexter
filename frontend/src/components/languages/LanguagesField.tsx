import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React from "react";
import { Controller, UseFormSetValue, useWatch } from "react-hook-form";
import {
  FormLanguage,
  ServerCorpus,
  ServerLanguage,
  ServerSource,
} from "../../model/DexterModel";
import { useDebounce } from "../../utils/useDebounce";
import {
  deleteLanguageFromCorpus,
  deleteLanguageFromSource,
  getLanguagesAutocomplete,
} from "../API";

interface LanguagesFieldProps {
  edit?: boolean;
  corpusId?: string | undefined;
  sourceId?: string | undefined;
  control: any;
  setValueCorpus?: UseFormSetValue<ServerCorpus>;
  setValueSource?: UseFormSetValue<ServerSource>;
}

export const LanguagesField = (props: LanguagesFieldProps) => {
  const { control } = props;
  const [languages, setLanguages] = React.useState<FormLanguage[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const debouncedInput = useDebounce<string>(inputValue, 250);
  const selectedItems = useWatch({ control, name: "languages" });

  const autoComplete = async (input: string) => {
    const result = await getLanguagesAutocomplete(input);
    setLanguages(result);
    setLoading(false);
    return result;
  };

  const deleteLanguageHandler = (language: ServerLanguage) => {
    if (!props.edit) {
      if (props.setValueCorpus) {
        props.setValueCorpus(
          "languages",
          selectedItems.filter((entry: ServerLanguage) => entry !== language)
        );
      }

      if (props.setValueSource) {
        props.setValueSource(
          "languages",
          selectedItems.filter((entry: ServerLanguage) => entry !== language)
        );
      }
    }

    if (props.corpusId) {
      deleteLanguageFromCorpusHandler(props.corpusId, language);
    }

    if (props.sourceId) {
      deleteLanguageFromSourceHandler(props.sourceId, language);
    }
  };

  const deleteLanguageFromCorpusHandler = async (
    corpusId: string,
    language: ServerLanguage
  ) => {
    const warning = window.confirm(
      "Are you sure you wish to delete this language?"
    );

    if (warning === false) return;

    await deleteLanguageFromCorpus(corpusId, language.id);
    props.setValueCorpus(
      "languages",
      selectedItems.filter((entry: ServerLanguage) => entry !== language)
    );
  };

  const deleteLanguageFromSourceHandler = async (
    sourceId: string,
    language: ServerLanguage
  ) => {
    const warning = window.confirm(
      "Are you sure you wish to delete this language?"
    );

    if (warning === false) return;

    await deleteLanguageFromSource(sourceId, language.id);
    props.setValueSource(
      "languages",
      selectedItems.filter((entry: ServerLanguage) => entry !== language)
    );
  };

  React.useEffect(() => {
    if (debouncedInput.length > 0) {
      autoComplete(debouncedInput);
      setLoading(true);
    }
  }, [debouncedInput]);

  return (
    <div>
      {languages && (
        <Controller
          control={props.control}
          name={"languages"}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              inputValue={inputValue}
              open={debouncedInput.length > 0}
              onInputChange={async (event, value) => {
                setInputValue(value);
              }}
              multiple={true}
              loading={loading}
              id="languages-autocomplete"
              options={languages}
              getOptionLabel={(language: FormLanguage) => language.refName}
              filterOptions={(x) => x}
              isOptionEqualToValue={(option, value) =>
                option.refName === value.refName
              }
              value={value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Search and select a language"
                  value={value}
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((language, index) => (
                  <Chip
                    label={language.refName}
                    key={index}
                    {...getTagProps({ index })}
                    onDelete={() => {
                      deleteLanguageHandler(language);
                    }}
                  />
                ))
              }
              onChange={(_, data) => {
                onChange(data);
              }}
              renderOption={(props, option, { inputValue }) => {
                const label = option.refName + " [" + option.id + "]";
                const matches = match(label, inputValue, { insideWords: true });
                const parts = parse(label, matches);

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