import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import React from "react";
import { ServerKeyword } from "../../Model/DexterModel";
import { deleteKeyword, getKeywords } from "../API";
import { NewKeywords } from "./NewKeywords";

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;
  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;

export const KeywordList = () => {
  const [keywords, setKeywords] = React.useState<ServerKeyword[]>();

  React.useEffect(() => {
    doGetKeywords();
  }, []);

  const doGetKeywords = async () => {
    const kw = await getKeywords();
    setKeywords(kw);
  };

  const handleDelete = async (id: string) => {
    const warning = window.confirm(
      "Are you sure you wish to delete this keyword?"
    );

    if (warning === false) return;

    await deleteKeyword(id);
    await doGetKeywords();
  };

  return (
    <>
      <NewKeywords setKeywords={setKeywords} />
      {keywords &&
        keywords.map((keyword: ServerKeyword, index: number) => (
          <div key={index}>
            {keyword.id} {keyword.val}{" "}
            {<DeleteIconStyled onClick={() => handleDelete(keyword.id)} />}
          </div>
        ))}
    </>
  );
};
