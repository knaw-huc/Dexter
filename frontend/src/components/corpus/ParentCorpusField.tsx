import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import React from "react"
import {ServerResultCorpus, ServerResultSource} from "../../model/DexterModel"

interface SubCorpusFieldProps {
    options: ServerResultCorpus[];
    selected?: ServerResultCorpus;
    onSelectParentCorpus: (corpusId: string) => void,
    onDeleteParentCorpus: () => void,
}

export const ParentCorpusField = (props: SubCorpusFieldProps) => {
    const [inputValue, setInputValue] = React.useState("")

    return <Autocomplete
        inputValue={inputValue}
        onInputChange={async (event, value) => {
            setInputValue(value)
        }}
        multiple={false}
        id="parent-corpus-autocomplete"
        options={props.options}
        getOptionLabel={(corpus: ServerResultCorpus) => corpus.title}
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) =>
            option.title === value?.title
        }
        value={props.selected}
        renderInput={(params) => (
            <TextField
                {...params}
                margin="dense"
                label="Select main corpus"
                value={inputValue}
            />
        )}
        onChange={(_, selected) => {
            const selectedCorpus = selected as ServerResultSource
            if (selectedCorpus?.id) {
                props.onSelectParentCorpus(selectedCorpus.id)
            } else {
                props.onDeleteParentCorpus()
            }
        }}
        renderOption={(props, option, {inputValue}) => {
            const matches = match(option.title, inputValue, {
                insideWords: true,
            })
            const parts = parse(option.title, matches)

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
            )
        }}
    />
}
