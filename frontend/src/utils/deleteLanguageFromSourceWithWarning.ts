import { deleteLanguageFromSource } from "./API";
import { ServerLanguage } from "../model/DexterModel";

export const deleteLanguageFromSourceWithWarning = async (
    language: ServerLanguage,
    sourceId: string
) => {
    const warning = window.confirm(
        "Are you sure you wish to delete this language?"
    );

    if (warning === false) return;

    await deleteLanguageFromSource(sourceId, language.id);
};
