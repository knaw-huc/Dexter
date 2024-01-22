import Autocomplete from "@mui/material/Autocomplete"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import React from "react"
import {ServerLanguage,} from "../../model/DexterModel"
import {useDebounce} from "../../utils/useDebounce"
import {getLanguagesAutocomplete,} from "../../utils/API"
import {TextFieldProps} from "@mui/material"

interface LanguagesFieldProps {
    selected: ServerLanguage[];
    onChangeSelected: (selected: ServerLanguage[]) => void
}

export const LanguagesField = (props: LanguagesFieldProps) => {
    const [options, setOptions] = React.useState<ServerLanguage[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const debouncedInput = useDebounce<string>(inputValue, 250)

    React.useEffect(() => {
        if (debouncedInput.length > 0) {
            autoComplete(debouncedInput)
            setLoading(true)
        }
    }, [debouncedInput])

    const autoComplete = async (input: string) => {
        const result = await getLanguagesAutocomplete(input)
        setOptions(result)
        setLoading(false)
        return result

    }
    const handleDeleteLanguage = (keyword: ServerLanguage) => {
        const newSelected = props.selected.filter(l => l.id !== keyword.id)
        props.onChangeSelected(newSelected)
    }

    function renderInputField(
        params: TextFieldProps
    ): JSX.Element {
        return <TextField
            {...params}
            value={inputValue}
            size={"medium"}
        />
    }

    return <Autocomplete
        inputValue={inputValue}
        open={debouncedInput.length > 0}
        onInputChange={async (event, value) => {
            setInputValue(value)
        }}
        multiple={true}
        loading={loading}
        id="languages-autocomplete"
        options={options}
        getOptionLabel={(language: ServerLanguage) => language.refName}
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) =>
            option.refName === value.refName
        }
        value={props.selected}
        renderInput={renderInputField}
        renderTags={(tagValue, getTagProps) =>
            tagValue.map((language, index) => (
                <Chip
                    label={language.refName}
                    key={index}
                    {...getTagProps({index})}
                    onDelete={() => handleDeleteLanguage(language)}
                />
            ))
        }
        onChange={(_, data) => {
            props.onChangeSelected(data as ServerLanguage[])
        }}
        renderOption={(props, option, {inputValue}) => {
            const label = option.refName + " [" + option.id + "]"
            const matches = match(label, inputValue, {insideWords: true})
            const parts = parse(label, matches)

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