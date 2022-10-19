import React from "react"
import { Control, Controller } from "react-hook-form"
import { Autocomplete } from "@mui/material"
import { TextField } from "@mui/material"
import { getKeywords } from "../API"
import { Collections } from "../../Model/DexterModel"
import parse from "autosuggest-highlight/parse"
import match from "autosuggest-highlight/match"


interface Keywords {
    id?: number,
    val: string
}

export const KeywordsField = ({ control }: { control: Control<Keywords | Collections> }) => {
    const [keywords, setKeywords] = React.useState<Keywords[]>()

    const doGetKeywords = async () => {
        const kw = await getKeywords()
        setKeywords(kw)
    }

    React.useEffect(() => {
        doGetKeywords()
    }, [])

    return (
        <div>
            {keywords && <Controller
                control={control}
                name={"val"}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        multiple={true}
                        id="keywords-autocomplete"
                        options={keywords}
                        getOptionLabel={(keyword: Keywords) => keyword.val}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Select a keyword"
                                onChange={onChange}
                                value={value}
                            />
                        )}
                        onChange={(event, values) => {
                            onChange(values)
                        }}
                    />
                )}
            />}
        </div>
    )
}