import { Autocomplete, Chip, TextField } from "@mui/material"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import React from "react"
import { Controller } from "react-hook-form"
import { FormKeyword } from "../../Model/DexterModel"
import { useDebounce } from "../../Utils/useDebounce"
import { getKeywordsAutocomplete } from "../API"

export const KeywordsField = ({ control }: { control: any }) => {
    const [keywords, setKeywords] = React.useState<FormKeyword[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const debouncedInput = useDebounce<string>(inputValue, 250)

    async function autoComplete(input: string) {
        const result = await getKeywordsAutocomplete(input)
        setKeywords(result)
        setLoading(false)
        //return result
    }

    React.useEffect(() => {
        if (debouncedInput.length > 2) {
            autoComplete(debouncedInput)
            setLoading(true)
        }
    }, [debouncedInput])

    return (
        <div>
            {keywords && <Controller
                control={control}
                name={"keywords"}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        inputValue={inputValue}
                        open={debouncedInput.length > 2}
                        onInputChange={async (event, value) => { setInputValue(value) }}
                        multiple={true}
                        loading={loading}
                        id="keywords-autocomplete"
                        options={keywords}
                        getOptionLabel={(keyword: FormKeyword) => keyword.val}
                        filterOptions={(x) => x}
                        isOptionEqualToValue={(option, value) => option.val === value.val}
                        value={value}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Select a keyword"
                                value={value}
                            />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                                <Chip
                                    label={option.val}
                                    key={index}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        onChange={(_, data) => {
                            onChange(data)
                        }}
                        renderOption={(props, option, { inputValue }) => {
                            const matches = match(option.val, inputValue, { insideWords: true })
                            const parts = parse(option.val, matches)

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