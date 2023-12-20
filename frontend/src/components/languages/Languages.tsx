import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import React from "react";
import { ServerLanguage } from "../../model/DexterModel";

type LanguagesContentProps = {
  languages: ServerLanguage[];
  onDelete?: (language: ServerLanguage) => Promise<void>;
};

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;
  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;

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