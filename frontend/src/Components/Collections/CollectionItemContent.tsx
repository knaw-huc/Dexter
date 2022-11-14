import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ServerCorpus,
  ServerKeyword,
  ServerLanguage,
  ServerSource,
} from "../../Model/DexterModel";
import { ACTIONS } from "../../State/actions";
import { collectionsContext } from "../../State/Collections/collectionContext";
import { errorContext } from "../../State/Error/errorContext";
import {
  deleteKeywordFromCorpus,
  deleteLanguageFromCorpus,
  getCollectionById,
  getKeywordsCorpora,
  getLanguagesCorpora,
  getSourcesInCorpus,
} from "../API";
import { KeywordContent } from "../keywords/KeywordContent";
import { LanguagesContent } from "../languages/LanguagesContent";
import { SourceItemDropdown } from "../Sources/SourceItemDropdown";
import { NewCollection } from "./NewCollection";

const Wrapper = styled.div`
  overflow: auto;
`;

export const CollectionItemContent = () => {
  const { errorDispatch } = React.useContext(errorContext);
  const [collection, setCollection] = React.useState<ServerCorpus>(null);
  const [sources, setSources] = React.useState<ServerSource[]>(null);
  const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null);
  const [languages, setLanguages] = React.useState<ServerLanguage[]>(null);

  const params = useParams();

  const { collectionsState, collectionsDispatch } =
    React.useContext(collectionsContext);
  const [showForm, setShowForm] = React.useState(false);

  const formShowHandler = () => {
    collectionsDispatch({
      type: ACTIONS.SET_TOEDITCOL,
      toEditCol: collection,
    });
    editHandler(true);
    setShowForm(true);
  };

  const formCloseHandler = () => {
    setShowForm(false);
  };

  const editHandler = (boolean: boolean) => {
    collectionsDispatch({
      type: ACTIONS.SET_EDITCOLMODE,
      editColMode: boolean,
    });
  };

  const doGetCollectionById = async (id: string) => {
    const response = await getCollectionById(id);
    setCollection(response as ServerCorpus);

    const kws = await getKeywordsCorpora(response.id);
    setKeywords(kws);

    const langs = await getLanguagesCorpora(response.id);
    setLanguages(langs);
  };

  const doGetSourcesInCorpus = async (corpusId: string) => {
    const srcs = await getSourcesInCorpus(corpusId);
    setSources(srcs);
    console.log(srcs);
  };

  React.useEffect(() => {
    doGetCollectionById(params.corpusId);
    doGetSourcesInCorpus(params.corpusId);
  }, [params.corpusId]);

  const refetchCollection = async () => {
    await doGetCollectionById(params.corpusId);
  };

  const deleteLanguageHandler = async (language: ServerLanguage) => {
    const warning = window.confirm(
      "Are you sure you wish to delete this language?"
    );

    if (warning === false) return;

    const corpusId = params.corpusId;

    await deleteLanguageFromCorpus(corpusId, language.id);
    await refetchCollection();
  };

  const deleteKeywordHandler = async (keyword: ServerKeyword) => {
    const warning = window.confirm(
      "Are you sure you wish to delete this keyword?"
    );

    if (warning === false) return;

    const corpusId = params.corpusId;
    keyword.id = "bla";

    const res = await deleteKeywordFromCorpus(corpusId, keyword.id);
    console.log(res);

    if (res === null) {
      errorDispatch({
        type: ACTIONS.SET_ERROR,
        message: `Could not delete keyword "${keyword.val}" from corpus!`,
      });
    }

    //await refetchCollection()
  };

  return (
    <Wrapper>
      {collection && sources && keywords && languages && (
        <>
          <Button variant="contained" onClick={formShowHandler}>
            Edit
          </Button>
          <p>
            <strong>Parent ID:</strong>{" "}
            <Link to={`/corpora/${collection.parentId}`}>
              {collection.parentId}
            </Link>
          </p>
          <p>
            <strong>Title:</strong> {collection.title}
          </p>
          <p>
            <strong>Description:</strong> {collection.description}
          </p>
          <p>
            <strong>Rights:</strong> {collection.rights}
          </p>
          <p>
            <strong>Access:</strong> {collection.access}
          </p>
          <p>
            <strong>Location:</strong> {collection.location}
          </p>
          <p>
            <strong>Earliest:</strong> {collection.earliest}
          </p>
          <p>
            <strong>Latest:</strong> {collection.latest}
          </p>
          <p>
            <strong>Contributor:</strong> {collection.contributor}
          </p>
          <p>
            <strong>Notes:</strong> {collection.notes}
          </p>
          <div>
            <strong>Keywords:</strong>{" "}
            <KeywordContent
              keywords={keywords}
              onDelete={deleteKeywordHandler}
            />
          </div>
          <div>
            <strong>Languages:</strong>{" "}
            <LanguagesContent
              languages={languages}
              onDelete={deleteLanguageHandler}
            />
          </div>
          <strong>Sources:</strong>{" "}
          {sources.map((source, index) => (
            <SourceItemDropdown
              key={index}
              source={source}
              corpusId={collection.id}
            />
          ))}
        </>
      )}
      {collectionsState.editColMode && (
        <NewCollection
          show={showForm}
          onEdit={editHandler}
          edit={collectionsState.editColMode}
          colToEdit={collectionsState.toEditCol}
          onClose={formCloseHandler}
          refetchCol={refetchCollection}
        />
      )}
    </Wrapper>
  );
};
