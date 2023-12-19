import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React from "react";
import { Controller } from "react-hook-form";

interface AccessFieldProps {
  control: any;
  edit: boolean;
}

const options = ["Open", "Restricted", "Closed"];

export const AccessField = (props: AccessFieldProps) => {
  const { control } = props;
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div>
      <Controller
        control={props.control}
        name={"access"}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            inputValue={inputValue}
            onInputChange={async (event, value) => {
              setInputValue(value);
            }}
            id="access-autocomplete"
            options={options}
            isOptionEqualToValue={(option, value) => option === value}
            value={value}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Select access level"
                value={value}
              />
            )}
            onChange={(_, data) => {
              onChange(data);
            }}
            renderOption={(props, option, { inputValue }) => {
              const matches = match(option, inputValue, {
                insideWords: true,
              });
              const parts = parse(option, matches);

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
    </div>
  );
};
