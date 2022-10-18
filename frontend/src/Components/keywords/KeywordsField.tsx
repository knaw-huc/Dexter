import React from "react"
import { Control, Controller } from "react-hook-form"
import { Autocomplete } from "@mui/material"
import { TextField } from "@mui/material"
import { getKeywords } from "../API"

interface Keywords {
    id?: number,
    val: string
}

export const KeywordsField = ({ control }: { control: any }) => {
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
                name={"keywords"}
                render={({ field: { onChange, value } }) => (
                    <Autocomplete
                        id="test"
                        options={keywords}
                        getOptionLabel={(keyword: Keywords) => keyword.val}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Select a keyword"
                                onChange={onChange}
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