import React from "react"
import {ServerLanguage} from "../../model/DexterModel"
import {DeleteIconStyled} from "../common/DeleteIconStyled"

type LanguagesContentProps = {
  languages: ServerLanguage[];
  onDelete?: (language: ServerLanguage) => Promise<void>;
};

export const Languages = (props: LanguagesContentProps) => {
  return (
    <>
      {props.languages &&
        props.languages.map((language, index) => {
          return (
            <p key={index}>
              {language.refName}{" "}
              {<DeleteIconStyled onClick={() => props.onDelete(language)} />}
            </p>
          );
        })}
    </>
  );
};