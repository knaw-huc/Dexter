import TextField from "@mui/material/TextField";
import React, {useContext} from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { FormKeyword, ServerKeyword } from "../../model/DexterModel";
import { createKeywords, getKeywords } from "../../utils/API";
import {errorContext} from "../../state/error/errorContext"

type NewKeywordsProps = {
  setKeywords: React.Dispatch<React.SetStateAction<ServerKeyword[]>>;
};

export const KeywordsForm = (props: NewKeywordsProps) => {
  const { register, handleSubmit } = useForm<FormKeyword>();
  const {dispatchError} = useContext(errorContext)
  const onSubmit: SubmitHandler<FormKeyword> = async (data) => {
    try {
      await createKeywords(data);
      const kw = await getKeywords();
      props.setKeywords(kw);
    } catch (error) {
      dispatchError(error)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Keyword</label>
        <TextField {...register("val")}>Keyword</TextField>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};