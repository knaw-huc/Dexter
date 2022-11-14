import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import React from "react";
import { ServerSource } from "../../Model/DexterModel";
import { deleteSourceFromCorpus } from "../API";
import { SourceItemDropdownContent } from "./SourceItemDropdownContent";

interface SourceItemDropdownProps {
  source: ServerSource;
  corpusId: string;
}

const SourceSnippet = styled.div`
  margin: 5px 0;
  padding: 10px;
  border-style: solid;
  border-color: darkgray;
  border-width: 1px;
`;

const Clickable = styled.div`
  cursor: pointer;
  font-weight: bold;
  display: inline-block;
  user-select: none;
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;
  color: gray;
  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;

export const SourceItemDropdown = (props: SourceItemDropdownProps) => {
  const [isOpen, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  const deleteHandler = async (corpusId: string, sourceId: string) => {
    const warning = window.confirm(
      "Are you sure you wish to delete this source from this corpus?"
    );

    if (warning === false) return;

    await deleteSourceFromCorpus(corpusId, sourceId);
  };

  return (
    <>
      <SourceSnippet id="source-snippet">
        <Clickable onClick={toggleOpen} id="clickable">
          {props.source.title}
        </Clickable>
        <DeleteIconStyled
          onClick={() => deleteHandler(props.corpusId, props.source.id)}
        />
        {isOpen && <SourceItemDropdownContent source={props.source} />}
      </SourceSnippet>
    </>
  );
};
