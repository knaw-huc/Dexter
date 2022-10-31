import React from "react"
import { Controller } from "react-hook-form"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { getLanguagesAutocomplete } from "../API"
import { FormLanguage } from "../../Model/DexterModel"
import parse from "autosuggest-highlight/parse"
import match from "autosuggest-highlight/match"
import { useDebounce } from "../../Utils/useDebounce"

export const LanguagesField = ({ control }: { control: any }) => {
    const [languages, setLanguages] = React.useState<FormLanguage[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const debouncedInput = useDebounce<string>(inputValue, 250)

    const autoComplete = async (input: string) => {
        const result = await getLanguagesAutocomplete(input)
        setLanguages(result)
        return result
    }

    React.useEffect(() => {
        if (debouncedInput.length > 0) {
            autoComplete(debouncedInput)
        }
    }, [debouncedInput])

    return (
        <div>
            {languages && <Controller
                control={control}
                name={"languages"}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        inputValue={inputValue}
                        open={debouncedInput.length > 0}
                        onInputChange={async (event, value) => { setInputValue(value) }}
                        multiple={true}
                        id="languages-autocomplete"
                        options={languages}
                        getOptionLabel={(language: FormLanguage) => language.refName}
                        filterOptions={(x) => x}
                        isOptionEqualToValue={(option, value) => option.refName === value.refName}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Select a language"
                                onChange={onChange}
                                value={value}
                            />
                        )}
                        renderOption={(props, option, { inputValue }) => {
                            const label = option.refName + " [" + option.id + "]"
                            const matches = match(label, inputValue, { insideWords: true })
                            const parts = parse(label, matches)

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