import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import React from "react";
import { useParams } from "react-router-dom";
import {
    ServerKeyword,
    ServerLanguage,
    ServerSource,
} from "../../Model/DexterModel";
import { Actions } from "../../State/actions";
import { sourcesContext } from "../../State/Sources/sourcesContext";
import { deleteKeywordFromSourceWithWarning } from "../../utils/deleteKeywordFromSourceWithWarning";
import { deleteLanguageFromSourceWithWarning } from "../../utils/deleteLanguageFromSourceWithWarning";
import { getKeywordsSources, getLanguagesSources, getSourceById } from "../API";
import { KeywordContent } from "../keywords/KeywordContent";
import { LanguagesContent } from "../languages/LanguagesContent";
import { SourceForm } from "./SourceForm";

export const SourcePage = () => {
    const [source, setSource] = React.useState<ServerSource>(null);
    const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null);
    const [languages, setLanguages] = React.useState<ServerLanguage[]>(null);

    const params = useParams();

    const { sources, setSources } = React.useContext(sourcesContext);
    const [showForm, setShowForm] = React.useState(false);

    const formShowHandler = () => {
        setSources({
            type: Actions.SET_TOEDITSOURCE,
            toEditSource: source,
        });
        editHandler(true);
        setShowForm(true);
    };

    const formCloseHandler = () => {
        setShowForm(false);
    };

    const editHandler = (boolean: boolean) => {
        setSources({
            type: Actions.SET_EDITSOURCEMODE,
            editSourceMode: boolean,
        });
    };

    const doGetSourceById = async (id: string) => {
        const response = await getSourceById(id);
        setSource(response as ServerSource);

        const kws = await getKeywordsSources(response.id);
        setKeywords(kws);
        console.log(kws);

        const langs = await getLanguagesSources(response.id);
        setLanguages(langs);
        console.log(langs);
    };

    React.useEffect(() => {
        doGetSourceById(params.sourceId);
    }, [params.sourceId]);

    const refetchSource = async () => {
        await doGetSourceById(params.sourceId);
    };

    const deleteLanguageHandler = async (language: ServerLanguage) => {
        await deleteLanguageFromSourceWithWarning(language, params.sourceId);
        await refetchSource();
    };

    const deleteKeywordHandler = async (keyword: ServerKeyword) => {
        await deleteKeywordFromSourceWithWarning(keyword, params.sourceId);
        await refetchSource();
    };

    return (
        <div>
            {source && keywords && languages && (
                <>
                    <Button variant="contained" onClick={formShowHandler}>
                        Edit
                    </Button>
                    <p>
                        <strong>External reference:</strong> {source.externalRef}
                    </p>
                    <p>
                        <strong>Title:</strong> {source.title}
                    </p>
                    <p>
                        <strong>Description:</strong> {source.description}
                    </p>
                    <p>
                        <strong>Creator:</strong> {source.creator}
                    </p>
                    <p>
                        <strong>Rights:</strong> {source.rights}
                    </p>
                    <p>
                        <strong>Access:</strong> {source.access}
                    </p>
                    <p>
                        <strong>Location:</strong> {source.location}
                    </p>
                    <p>
                        <strong>Earliest:</strong> {source.earliest}
                    </p>
                    <p>
                        <strong>Latest:</strong> {source.latest}
                    </p>
                    <p>
                        <strong>Notes:</strong> {source.notes}
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
                </>
            )}
            {sources.editSourceMode && (
                <SourceForm
                    show={showForm}
                    onEdit={editHandler}
                    edit={sources.editSourceMode}
                    sourceToEdit={sources.toEditSource}
                    onClose={formCloseHandler}
                    refetchSource={refetchSource}
                />
            )}
        </div>
    );
};
