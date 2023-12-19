import React from "react";
import {
  ServerKeyword,
  ServerLanguage,
  ServerSource,
} from "../../Model/DexterModel";
import { deleteKeywordFromSourceWithWarning } from "../../utils/deleteKeywordFromSourceWithWarning";
import { deleteLanguageFromSourceWithWarning } from "../../utils/deleteLanguageFromSourceWithWarning";
import { getKeywordsSources, getLanguagesSources } from "../API";
import { KeywordContent } from "../keywords/KeywordContent";
import { LanguagesContent } from "../languages/LanguagesContent";

interface SourceItemDropdownContentProps {
  source: ServerSource | undefined;
}

export const SourceItemDropdownContent = (
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
        </div>
      )}
    </>
  );
};
