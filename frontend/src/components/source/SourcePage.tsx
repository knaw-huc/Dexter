import React from "react"
import {useParams} from "react-router-dom"
import {ServerKeyword, ServerLanguage, ServerSource,} from "../../model/DexterModel"
import {deleteKeywordFromSourceWithWarning} from "../../utils/deleteKeywordFromSourceWithWarning"
import {deleteLanguageFromSourceWithWarning} from "../../utils/deleteLanguageFromSourceWithWarning"
import {getKeywordsSources, getLanguagesSources, getSourceById} from "../../utils/API"
import {Languages} from "../language/Languages"
import {SourceForm} from "./SourceForm"
import {EditButton} from "../common/EditButton"
import {KeywordList} from "../keyword/KeywordList"

export const SourcePage = () => {
    const params = useParams();
    const sourceId = params.sourceId

    const [source, setSource] = React.useState<ServerSource>(null);
    const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null);
    const [languages, setLanguages] = React.useState<ServerLanguage[]>(null);


    const [showForm, setShowForm] = React.useState(false);

    const handleSaveForm = () => {
        initSource()
        setShowForm(false);
    };

    const initSource = async () => {
        const source = await getSourceById(sourceId);
        setSource(source);

        const keywords = await getKeywordsSources(sourceId);
        setKeywords(keywords);

        const languages = await getLanguagesSources(sourceId);
        setLanguages(languages);
    };

    React.useEffect(() => {
        if(sourceId) {
            initSource();
        }
    }, [sourceId]);

    const refetchSource = async () => {
        await initSource();
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
                    <EditButton onEdit={() => {
                        setShowForm(true);
                    }}/>
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
                        <KeywordList
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
                </>
            )}
            {showForm && <SourceForm
                sourceToEdit={source}
                onSave={handleSaveForm}
                onClose={() => {
                    setShowForm(false);
                }}
            />}
        </div>
    );
};
