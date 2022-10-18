import React from "react"
import TextField from "@mui/material/TextField"
import { useForm, SubmitHandler } from "react-hook-form"
import { Keywords } from "../../Model/DexterModel"
import { createKeywords, getKeywords } from "../API"

type NewKeywordsProps = {
    setKeywords: React.Dispatch<React.SetStateAction<Keywords[]>>
}

export const NewKeywords = (props: NewKeywordsProps) => {
    const { register, handleSubmit } = useForm<Keywords>()
    const onSubmit: SubmitHandler<Keywords> = async data => {
        try {
            await createKeywords(data)
            const kw = await getKeywords()
            props.setKeywords(kw)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Keyword</label>
                <TextField {...register("val")}>Keyword</TextField>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}