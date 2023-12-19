import { deleteKeywordFromSource } from "../Components/API";
import { ServerKeyword } from "../Model/DexterModel";

export const deleteKeywordFromSourceWithWarning = async (
    keyword: ServerKeyword,
    sourceId: string
) => {
    const warning = window.confirm(
        "Are you sure you wish to delete this keyword?"
    );

    if (warning === false) return;

    await deleteKeywordFromSource(sourceId, keyword.id);
};
