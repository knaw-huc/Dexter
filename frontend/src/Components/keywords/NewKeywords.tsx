import React from "react"
import TextField from "@mui/material/TextField"
import { useForm, SubmitHandler } from "react-hook-form"
//import { Keywords } from "../../Model/DexterModel"
import { createKeywords } from "../API"

type Keywords = {
    val: string
}

export const NewKeywords = () => {
    const { register, handleSubmit } = useForm<Keywords>()
    const onSubmit: SubmitHandler<Keywords> = async data => {
        try {
            await createKeywords(data)
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