import TextField from "@mui/material/TextField"
import React, {useContext, useState} from "react"
import {ServerKeyword} from "../../model/DexterModel"
import {createKeyword, getKeywords} from "../../utils/API"
import {errorContext} from "../../state/error/errorContext"
import {Button, Grid} from "@mui/material"

type NewKeywordsProps = {
    setKeywords: React.Dispatch<React.SetStateAction<ServerKeyword[]>>;
};

export function KeywordForm(props: NewKeywordsProps) {
    const {dispatchError} = useContext(errorContext)
    const [keyword, setKeyword] = useState("")

    async function handleCreateKeyword() {
        try {
            await createKeyword({val: keyword})
            const all = await getKeywords()
            props.setKeywords(all)
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
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateKeyword();
                            }
                        }}
                        onChange={e => setKeyword(e.currentTarget.value)}
                        autoFocus
                    />
                </Grid>
                <Grid item alignItems="stretch" style={{display: "flex"}}>
                    <Button
                        onClick={handleCreateKeyword}
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