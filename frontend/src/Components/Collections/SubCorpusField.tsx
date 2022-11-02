import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import React from "react"
import { Controller } from "react-hook-form"
import { ServerCorpus } from "../../Model/DexterModel"

interface SubCorpusFieldProps {
    corpora: ServerCorpus[],
    control: any
}

export const SubCorpusField = (props: SubCorpusFieldProps) => {
    const [inputValue, setInputValue] = React.useState("")

    return (
        <div>
            {props.corpora && <Controller
                control={props.control}
                name={"parentId"}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        inputValue={inputValue}
                        onInputChange={async (event, value) => { setInputValue(value) }}
                        multiple={true}
                        id="subcorpus-autocomplete"
                        options={props.corpora}
                        getOptionLabel={(corpus: ServerCorpus) => corpus.title}
                        filterOptions={(x) => x}
                        isOptionEqualToValue={(option, value) => option.title === value.title}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Select a corpus"
                                onChange={onChange}
                                value={value}
                            />
                        )}
                        onChange={(_, data) => {
                            onChange(data)
                        }}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(option.title, inputValue, { insideWords: true })
                            const parts = parse(option.title, matches)

                            return (
                                <li {...props}>
                                    <div>
                                        {parts.map((part, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    fontWeight: part.highlight ? 700 : 400
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
                )}
            />}
        </div>
    )
}