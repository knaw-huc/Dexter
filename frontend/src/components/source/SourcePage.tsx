import React from "react"
import {useParams} from "react-router-dom"
import {ServerKeyword, ServerLanguage, Source,} from "../../model/DexterModel"
import {deleteKeywordFromSourceWithWarning} from "../../utils/deleteKeywordFromSourceWithWarning"
import {deleteLanguageFromSourceWithWarning} from "../../utils/deleteLanguageFromSourceWithWarning"
import {getSourceWithResourcesById} from "../../utils/API"
import {Languages} from "../language/Languages"
import {SourceForm} from "./SourceForm"
import {EditButton} from "../common/EditButton"
import {KeywordList} from "../keyword/KeywordList"
import _ from "lodash"
import {ShortFieldsSummary} from "../common/ShortFieldsSummary"

export const SourcePage = () => {
    const params = useParams();
    const sourceId = params.sourceId

    const [source, setSource] = React.useState<Source>(null);
    const [showForm, setShowForm] = React.useState(false);

    const handleSaveForm = (update: Source) => {
        setSource(update)
        setShowForm(false);
    };

    const initSource = async () => {
        const source = await getSourceWithResourcesById(sourceId);
        setSource(source);
    };

    React.useEffect(() => {
        if(sourceId) {
            initSource();
        }
    }, [sourceId]);

    const refetchSource = async () => {
        await initSource();
    };

    const handleDeleteLanguage = async (language: ServerLanguage) => {
        await deleteLanguageFromSourceWithWarning(language, params.sourceId);
        await refetchSource();
    };

    const handleDeleteKeyword = async (keyword: ServerKeyword) => {
        await deleteKeywordFromSourceWithWarning(keyword, params.sourceId);
        await refetchSource();
    };

    const shortSourceFields: (keyof Source)[] = ["location", "earliest", "latest", "rights", "access", "creator"]

    return (
        <div>
            {source && (
                <>
                    <EditButton onEdit={() => {
                        setShowForm(true);
                    }}/>
                    <h1>{source.title}</h1>
                    <p>{source.description}</p>
                    {source.externalRef && <p>
                        <strong>External reference:</strong> {source.externalRef}
                    </p>}
                    <div>
                        <KeywordList
                            keywords={source.keywords}
                            onDelete={handleDeleteKeyword}
                        />
                    </div>
                    <ShortFieldsSummary<Source>
                        resource={source}
                        fieldNames={shortSourceFields}
                    />
                    {source.notes && <>
                        <h2>Notes</h2>
                        <p>{source.notes}</p>
                    </>}
                    {!_.isEmpty(source.languages) && <div>
                        <h4>Languages:</h4>
                        <Languages
                            languages={source.languages}
                            onDelete={handleDeleteLanguage}
                        />
                    </div>}
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
