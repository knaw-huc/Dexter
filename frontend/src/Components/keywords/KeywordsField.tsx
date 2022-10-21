import React from "react"
import { Control, Controller } from "react-hook-form"
import { Autocomplete } from "@mui/material"
import { TextField } from "@mui/material"
import { getKeywordsAutocomplete } from "../API"
import { Collections, Sources, Keywords } from "../../Model/DexterModel"
import parse from "autosuggest-highlight/parse"
import match from "autosuggest-highlight/match"
import { useDebounce } from "../../Utils/useDebounce"

export const KeywordsField = ({ control }: { control: Control<Keywords | Collections | Sources> }) => {
    const [keywords, setKeywords] = React.useState<Keywords[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const debouncedInput = useDebounce<string>(inputValue, 250)

    async function autoComplete(input: string) {
        const result = await getKeywordsAutocomplete(input)
        setKeywords(result)
        return result
    }

    React.useEffect(() => {
        if (debouncedInput.length > 2) {
            autoComplete(debouncedInput)
        }
    }, [debouncedInput])

    return (
        <div>
            {keywords && <Controller
                control={control}
                name={"val"}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        inputValue={inputValue}
                        open={debouncedInput.length > 2}
                        onInputChange={async (event, value) => { setInputValue(value) }}
                        multiple={true}
                        id="keywords-autocomplete"
                        options={keywords}
                        getOptionLabel={(keyword: Keywords) => keyword.val}
                        filterOptions={(x) => x}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Select a keyword"
                                onChange={onChange}
                                value={value}
                            />
                        )}
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
                        onChange={(event, values) => {
                            onChange(values)
                        }}
                    />
                )}
            />}
        </div>
    )
}