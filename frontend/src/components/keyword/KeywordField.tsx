import {Autocomplete, Chip, TextField} from "@mui/material"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import React from "react"
import {ServerKeyword,} from "../../model/DexterModel"
import {useDebounce} from "../../utils/useDebounce"
import {getKeywordsAutocomplete,} from "../../utils/API"

interface KeywordsFieldProps {
    selected: ServerKeyword[];
    onChangeSelected: (selected: ServerKeyword[]) => void
}

const MIN_AUTOCOMPLETE_LENGTH = 1

export const KeywordField = (props: KeywordsFieldProps) => {
    const [suggestions, setSuggestions] = React.useState<ServerKeyword[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const debouncedInput = useDebounce<string>(inputValue, 250)

    async function autoComplete(input: string) {
        const result = await getKeywordsAutocomplete(input)
        setSuggestions(result)
        setLoading(false)
    }

    const deleteKeyword = (keyword: ServerKeyword) => {
        if (!window.confirm(
            "Are you sure you wish to delete this keyword?"
        )) {
            return
        }
        const newSelected = props.selected.filter(k => k.id !== keyword.id)
        props.onChangeSelected(newSelected)
    }

    React.useEffect(() => {
        if (debouncedInput.length >= MIN_AUTOCOMPLETE_LENGTH) {
            autoComplete(debouncedInput)
            setLoading(true)
        }
    }, [debouncedInput])

    return <Autocomplete
        inputValue={inputValue}
        open={debouncedInput.length >= MIN_AUTOCOMPLETE_LENGTH}
        onInputChange={async (event, value) => {
            setInputValue(value)
        }}
        multiple={true}
        loading={loading}
        id="keywords-autocomplete"
        options={suggestions}
        getOptionLabel={(keyword: ServerKeyword) => keyword.val}
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) => option.val === value.val}
        value={props.selected}
        renderInput={(params) => (
            <TextField
                {...params}
                margin="dense"
                label="Search and select keywords"
                value={inputValue}
            />
        )}
        renderTags={(tagValue, getTagProps) =>
            tagValue.map((keyword, index) => (
                <Chip
                    label={keyword.val}
                    key={index}
                    {...getTagProps({index})}
                    onDelete={() => {
                        deleteKeyword(keyword)
                    }}
                />
            ))
        }
        onChange={(_, data) => {
            props.onChangeSelected(data as ServerKeyword[])
        }}
        renderOption={(props, option, {inputValue}) => {
            const matches = match(option.val, inputValue, {
                insideWords: true,
            })
            const parts = parse(option.val, matches)

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