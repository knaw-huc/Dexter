import {FormMetadataValue, MetadataValue} from "../model/DexterModel"

export function compareFormMetadataValues(v1: FormMetadataValue, v2: FormMetadataValue) {
    return v1.keyId > v2.keyId ? -1 : 1
}

export function compareMetadataValues(v1: MetadataValue, v2: MetadataValue) {
    return v1.key.id > v2.key.id ? -1 : 1
}
