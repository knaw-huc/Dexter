import React from "react"
import {ServerKeyword} from "../../model/DexterModel"
import {DeleteIconStyled} from "../common/DeleteIconStyled"

type KeywordContentProps = {
  keywords: ServerKeyword[];
  onDelete?: (keyword: ServerKeyword) => Promise<void>;
};

export const Keyword = (props: KeywordContentProps) => {
  return (
    <>
      {props.keywords &&
        props.keywords.map((keyword, index) => {
          return (
            <p key={index}>
              {keyword.val}{" "}
              {<DeleteIconStyled onClick={() => props.onDelete(keyword)} />}
            </p>
          );
        })}
    </>
  );
};