import Button from "@mui/material/Button"
import React, {useState} from "react"
import ScrollableModal from "../common/ScrollableModal"
import {ServerSource} from "../../model/DexterModel"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Chip from "@mui/material/Chip"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

export type LinkSourceFormProps = {
    all: ServerSource[],
    selected: ServerSource[],
    onLinkSource: (sourceId: string) => void,
    onUnlinkSource: (sourceId: string) => void,
    onClose: () => void
}

export function LinkSourceForm(props: LinkSourceFormProps) {
    const [inputValue, setInputValue] = useState<string>("")
    console.log('render', props.all, props.selected);
    return (
        <>
            <ScrollableModal
                show={true}
                handleClose={props.onClose}
            >

                <Autocomplete
                    inputValue={inputValue}
                    onInputChange={async (event, value) => {
                        setInputValue(value)
                    }}
                    multiple={true}
                    id="partofsource-autocomplete"
                    options={props.all}
                    getOptionLabel={(source: ServerSource) => source.title}
                    filterOptions={(x) => x}
                    isOptionEqualToValue={(option, value) =>
                        option.title === value.title
                    }
                    filterSelectedOptions
                    value={props.selected}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            margin="dense"
                            label="Search and select sources"
                            value={inputValue}
                        />
                    )}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((source, index) => (
                            <Chip
                                label={source.title}
                                key={index}
                                {...getTagProps({index})}
                                onDelete={() => {
                                    props.onUnlinkSource(source.id)
                                }}
                            />
                        ))
                    }
                    onChange={(_, selected) => {
                        const selectedSource = selected.at(-1) as ServerSource
                        if(!selectedSource) {
                            return;
                        }
                        props.onLinkSource(selectedSource.id)
                    }}
                    renderOption={(props, option, {inputValue}) => {
                        const matches = match(option.title, inputValue, {
                            insideWords: true,
                        })
                        const parts = parse(option.title, matches)

                        return (
                            <li {...props}>
                                <div>
                                    {parts.map((part, index) => (<span
                                        key={index}
                                        style={{
                                            fontWeight: part.highlight ? 700 : 400,
                                        }}
                                    >
                                      {part.text}
                                    </span>))}
                                </div>
                            </li>
                        )
                    }}
                />

                <Button variant="contained" onClick={props.onClose}>
                    Close
                </Button>
            </ScrollableModal>
        </>
    )
}
