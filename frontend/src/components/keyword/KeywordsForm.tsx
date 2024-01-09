import TextField from "@mui/material/TextField"
import React, {useContext, useState} from "react"
import {ServerKeyword} from "../../model/DexterModel"
import {createKeywords, getKeywords} from "../../utils/API"
import {errorContext} from "../../state/error/errorContext"
import {Button, Grid} from "@mui/material"

type NewKeywordsProps = {
    setKeywords: React.Dispatch<React.SetStateAction<ServerKeyword[]>>;
};

export function KeywordsForm(props: NewKeywordsProps) {
    const {dispatchError} = useContext(errorContext)
    const [keyword, setKeyword] = useState("")

    async function createKeyword() {
        try {
            await createKeywords({val: keyword})
            const kw = await getKeywords()
            props.setKeywords(kw)
            setKeyword("")
        } catch (error) {
            dispatchError(error)
        }
    }

    return (
        <div>
            <h1>Keywords</h1>
            <Grid container>
                <Grid item>
                    <TextField
                        variant="outlined"
                        placeholder="Add keyword..."
                        value={keyword}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                createKeyword()
                            }
                        }}
                        onChange={e => setKeyword(e.currentTarget.value)}
                        autoFocus
                    />
                </Grid>
                <Grid item alignItems="stretch" style={{display: "flex"}}>
                    <Button
                        onClick={createKeyword}
                        sx={{ml: "0.5em"}}
                        variant="contained"
                    >
                        Create ⏎
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}