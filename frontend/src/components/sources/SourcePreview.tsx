import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import {red} from "@mui/material/colors"
import React from "react"
import {ServerKeyword, ServerLanguage, ServerSource} from "../../model/DexterModel"
import {deleteSourceFromCorpus, getKeywordsSources, getLanguagesSources} from "../../utils/API"
import {deleteKeywordFromSourceWithWarning} from "../../utils/deleteKeywordFromSourceWithWarning"
import {deleteLanguageFromSourceWithWarning} from "../../utils/deleteLanguageFromSourceWithWarning"
import {Keyword} from "../keywords/Keyword"
import {Languages} from "../languages/Languages"

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

export const SourcePreview = (props: SourceItemDropdownProps) => {
  const [isOpen, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  const deleteHandler = async (corpusId: string, sourceId: string) => {
    if(!window.confirm(
      "Are you sure you wish to delete this source from this corpus?"
    )) {
        return;
    }
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
        {isOpen && <SourceDropdown source={props.source} />}
      </SourceSnippet>
    </>
  );
};

interface SourceItemDropdownContentProps {
    source: ServerSource | undefined;
}

const SourceDropdown = (
    props: SourceItemDropdownContentProps
) => {
    const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null);
    const [languages, setLanguages] = React.useState<ServerLanguage[]>(null);

    const doGetSourceKeywords = async (sourceId: string) => {
        const kws = await getKeywordsSources(sourceId);
        setKeywords(kws);
    };

    const doGetSourceLanguages = async (sourceId: string) => {
        const langs = await getLanguagesSources(sourceId);
        setLanguages(langs);
    };

    const deleteKeywordHandler = async (keyword: ServerKeyword) => {
        await deleteKeywordFromSourceWithWarning(keyword, props.source.id);
    };

    const deleteLanguageHandler = async (language: ServerLanguage) => {
        await deleteLanguageFromSourceWithWarning(language, props.source.id);
        window.location.reload();
    };

    React.useEffect(() => {
        doGetSourceKeywords(props.source.id);
        doGetSourceLanguages(props.source.id);
    }, [props.source.id]);

    return (
        <>
            {props.source && keywords && languages && (
                <div id="source-content">
                    <p>
                        <strong>External reference:</strong> {props.source.externalRef}
                    </p>
                    <p>
                        <strong>Title:</strong> {props.source.title}
                    </p>
                    <p>
                        <strong>Description:</strong> {props.source.description}
                    </p>
                    <p>
                        <strong>Rights:</strong> {props.source.rights}
                    </p>
                    <p>
                        <strong>Access:</strong> {props.source.access}
                    </p>
                    <p>
                        <strong>Location:</strong> {props.source.location}
                    </p>
                    <p>
                        <strong>Earliest:</strong> {props.source.earliest}
                    </p>
                    <p>
                        <strong>Latest:</strong> {props.source.latest}
                    </p>
                    <p>
                        <strong>Notes:</strong> {props.source.notes}
                    </p>
                    <div>
                        <strong>Keywords:</strong>{" "}
                        <Keyword
                            keywords={keywords}
                            onDelete={deleteKeywordHandler}
                        />
                    </div>
                    <div>
                        <strong>Languages:</strong>{" "}
                        <Languages
                            languages={languages}
                            onDelete={deleteLanguageHandler}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
